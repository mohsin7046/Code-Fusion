import amqplib from 'amqplib'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let channel;

 export const setUpRabbitMQ = async() => {
    const connection = await amqplib.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('code_updates');

    channel.consume('code_updates', async (msg) => {
    if (msg !== null) {
      try {
        const { roomId, code } = JSON.parse(msg.content.toString());

        const room = await prisma.room.findUnique({
          where: { roomId },
          include: {
            codingTest: true,
          },
        });

        if (!room) throw new Error(`Room ${roomId} not found`);

        const codingTestId = room.codingTestId;

        const codingTestResponse = await prisma.codingTestResponse.findFirst({
          where: {
            codingTestId,
          },
        });

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

        console.log(`Updated code for candidate ${candidateId} in test ${codingTestId}`);
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
    }
}