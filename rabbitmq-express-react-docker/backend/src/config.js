const path = require('path');
require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 8080),
  rabbitUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  queueName: process.env.QUEUE_NAME || 'jobs',
  dataDir: process.env.DATA_DIR || path.join(__dirname, '..', 'data'),
};
