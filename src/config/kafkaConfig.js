const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'movie-app',
  brokers: ['localhost:9092'],
});

module.exports = kafka;

