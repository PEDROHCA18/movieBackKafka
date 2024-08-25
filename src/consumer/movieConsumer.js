const kafka = require('../config/kafkaConfig');
const consumer = kafka.consumer({ groupId: 'movie-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'NEW_MOVIES', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const movie = JSON.parse(message.value.toString());
      console.log('Recebendo novo filme:', movie);

      // Aqui você pode adicionar lógica para salvar o filme em um banco de dados

      console.log('Filme processado com sucesso.');
    },
  });
};

run().catch(console.error);
