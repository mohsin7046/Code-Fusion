import amqplib from 'amqplib'

let channel;

 export const setUpRabbitMQ = async() => {
    const connection = await amqplib.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('code_updates');

    channel.consume('code-update',(msg)=>{
        const {roomId,code} = JSON.parse(msg.content.toString());

        console.log('MongoDB Save:', sessionId);

        channel.ack(msg);
    })
 }

export const publicMessage = (queue,message) => {
    if(channel){
        channel.sendToQueue(queue,Buffer.from(JSON.stringify(message)));
    }
}