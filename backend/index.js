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

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

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

const prisma = new PrismaClient();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, userId }) => {
    console.log(`User ${userId} joining room ${roomId}`);
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(userId);

    socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });

    const existingUsers = Array.from(rooms.get(roomId)).filter(
      (id) => id !== userId
    );
    socket.emit('existing-users', existingUsers);
  });

  socket.on('send-message', ({ roomId, message }) => {
    io.to(roomId).emit('receive-message', message);
  });

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

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    rooms.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        handleUserLeaving(socket, roomId, socket.id);
      }
    });
  });
});

function handleUserLeaving(socket, roomId, userId) {
  console.log(`User ${userId} leaving room ${roomId}`);
  if (rooms.has(roomId)) {
    rooms.get(roomId).delete(userId);
    if (rooms.get(roomId).size === 0) {
      rooms.delete(roomId);
    }
  }
  socket.to(roomId).emit('user-left', { userId });
  socket.leave(roomId);
}

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
