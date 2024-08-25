const kafka = require('../config/kafkaConfig');
const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  const movie = {
    title: "Inception",
    director: "Christopher Nolan",
    releaseYear: 2011
  };

  await producer.send({
    topic: 'NEW_MOVIES',
    messages: [
      { key: 'NEW_MOVIE', value: JSON.stringify(movie) },
    ],
  });

  console.log('Filme enviado com sucesso!');
  await producer.disconnect();
};

run().catch(console.error);
