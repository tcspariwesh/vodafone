const amqplib = require('amqplib');
const { rabbitUrl, queueName } = require('./config');

let connection;
let channel;

async function connectRabbit() {
  if (channel) return channel;

  connection = await amqplib.connect(rabbitUrl);
  connection.on('error', (err) => {
    console.error('[rabbitmq] connection error:', err.message);
  });

  connection.on('close', () => {
    console.warn('[rabbitmq] connection closed');
    connection = null;
    channel = null;
  });

  channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });

  return channel;
}

async function publishJob(message) {
  const ch = await connectRabbit();
  const payload = Buffer.from(JSON.stringify(message));
  ch.sendToQueue(queueName, payload, {
    persistent: true,
    contentType: 'application/json',
  });
}

async function consumeJobs(handler) {
  const ch = await connectRabbit();
  await ch.prefetch(1);

  await ch.consume(queueName, async (msg) => {
    if (!msg) return;
    try {
      const content = JSON.parse(msg.content.toString('utf8'));
      await handler(content);
      ch.ack(msg);
    } catch (err) {
      console.error('[rabbitmq] message failed:', err.message);
      ch.nack(msg, false, false);
    }
  });
}

module.exports = {
  connectRabbit,
  publishJob,
  consumeJobs,
};
