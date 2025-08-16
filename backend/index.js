import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'
import chatUser from './routes/chat.route.js'
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import OnlineTest from './routes/recruiterRoutes/onlineTest.route.js';
import Summary from './routes/recruiterRoutes/summary.route.js'
import BehaviourTest from './routes/recruiterRoutes/behaviouralTest.route.js';
import JobApplication from './routes/jobApplication.route.js';
import OnlineTestResponse from './routes/userRoutes/onlineTest_response.route.js';
import BehaviourTestResponse from './routes/userRoutes/behaviourTest_response.route.js';
import CodingTest from './routes/recruiterRoutes/codingTest.route.js'
import CodingResponse from './routes/userRoutes/codingTest_response.route.js'
import ScheduleRoute from './routes/recruiterRoutes/automation.route.js'
import UserDataUpload from  './routes/userRoutes/dataUpload.routes.js';
import AllJobs from './routes/userRoutes/jobs.routes.js';
import Redis from 'ioredis'
import { publicMessage } from './rabbitQueue/rabbit.js';
import { setUpRabbitMQ } from './rabbitQueue/rabbit.js';


dotenv.config();


const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const redis = new Redis();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

const rooms = new Map();

app.use('/api/auth', authRoutes);
app.use('/api/chat',chatUser);
app.use('/api/recruiter',OnlineTest);
app.use('/api/recruiter', Summary);
app.use('/api/recruiter', BehaviourTest);
app.use('/api/user/onlinetest', OnlineTestResponse);
app.use('/api', JobApplication);
app.use('/api/user/behaviouraltest', BehaviourTestResponse);
app.use('/api/user/codingtest', CodingResponse);
app.use('/api/recruiter',CodingTest);
app.use('/api/recruiter/schedule',ScheduleRoute);
app.use('/api/user', UserDataUpload);
app.use('/api/user', AllJobs);

const prisma = new PrismaClient();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', async({ roomId, userId }) => {
    console.log(`User ${userId} joining room ${roomId}`);
    socket.join(roomId);

    await redis.sadd(`room:${roomId}`, userId);


    const cached = await redis.get(roomId);
    socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
    
    
    socket.emit('load-code', cached || '');

    const allUsers = await redis.smembers(`room:${roomId}`);
    const existingUsers = allUsers.filter(id => id !== userId);

    socket.emit('existing-users', existingUsers);
  });


  socket.on('send-message', ({ roomId, message }) => {
    io.to(roomId).emit('receive-message', message);
  });

  socket.on('code-changed',async({roomId,code})=>{
    await redis.set(roomId,code);
    publicMessage('code_updates',{roomId,code});
   
    socket.to(roomId).emit('realtime-load-code',code);
  })

  
  socket.on('offer', ({ offer, to, from }) => {
    socket.to(to).emit('offer', { offer, from });
  });

  socket.on('answer', ({ answer, to, from }) => {
    socket.to(to).emit('answer', { answer, from });
  });

  socket.on('ice-candidate', ({ candidate, to, from }) => {
    socket.to(to).emit('ice-candidate', { candidate, from });
  });

  socket.on('leave-room', ({ roomId, userId }) => {
    handleUserLeaving(socket, roomId, userId);
  });

  socket.on('disconnect', async() => {
    console.log('User disconnected:', socket.id);

    const roomKeys = await redis.keys('room:*');

    for (const key of roomKeys) {
      const roomId = key.split(':')[1];
      const removed = await redis.srem(key, socket.id);
      if (removed > 0) {
        await handleUserLeaving(socket, roomId, socket.id);
      }
    }
  });
});


async function handleUserLeaving(socket, roomId, userId) {
  console.log(`User ${userId} leaving room ${roomId}`);

  await redis.srem(`room:${roomId}`, userId);
  const remaining = await redis.scard(`room:${roomId}`);

  if (remaining === 0) {
    await redis.del(`room:${roomId}`);
  }

  socket.to(roomId).emit('user-left', { userId });
  socket.leave(roomId);
}

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
    setUpRabbitMQ();
});
