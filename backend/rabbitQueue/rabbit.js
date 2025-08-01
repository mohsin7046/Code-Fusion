import amqplib from 'amqplib'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let channel;

 export const setUpRabbitMQ = async() => {

  if (channel) {
    console.log('RabbitMQ already initialized, skipping...');
    return;
  }

    const connection = await amqplib.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('code_updates');
    console.log("RabbitMQ connected and consumer set up");


    channel.consume('code_updates', async (msg) => {

       console.log("Received message from RabbitMQ");
      
     if (msg && msg !== null) {
      try {
        const { roomId, code } = JSON.parse(msg.content.toString());

        console.log("In the Queue",roomId, code);
        
        const room = await prisma.room.findMany({
          where: { roomId },
        });

        if (!room) throw new Error(`Room ${roomId} not found`);
        console.log(room);
        

        const codingTestId = room[0]?.codingTestId;

        const codingTestResponse = await prisma.codingTestResponse.findFirst({
          where: {
            codingTestId,
          },
        });

        console.log(`CodingTestResponse for ${codingTestId}:`, codingTestResponse);
        

        if (!codingTestResponse) {
          console.warn('No matching CodingTestResponse found, skipping update.');
          return channel.ack(msg); 
        }

        await prisma.codingTestResponse.update({
          where: { id: codingTestResponse.id },
          data: {
            code,
            updatedAt: new Date(),
          },
        });

        console.log(`Updated code for candidate ${codingTestResponse?.candidateId} in test ${codingTestId}`);
        channel.ack(msg);
      } catch (error) {
        console.error('RabbitMQ Consumer Error:', error);
        channel.nack(msg, false, false); 
      }
    }
})
 }

export const publicMessage = (queue,message) => {
 
    if(channel){
        channel.sendToQueue(queue,Buffer.from(JSON.stringify(message)));
    }else{
        console.warn("Channel not initialized");
    }
}