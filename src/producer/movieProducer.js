const kafka = require('../config/kafkaConfig');
const readline = require('readline');

const producer = kafka.producer();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};

const run = async () => {
  try {
    await producer.connect();

    // Recebe os detalhes do filme do usuário
    const title = await askQuestion('Digite o título do filme: ');
    const director = await askQuestion('Digite o diretor do filme: ');
    const releaseYear = await askQuestion('Digite o ano de lançamento do filme: ');

    const movie = {
      title,
      director,
      releaseYear: parseInt(releaseYear, 10)
    };

    // Envia a mensagem para o tópico NEW_MOVIES
    await producer.send({
      topic: 'NEW_MOVIES',
      messages: [
        { key: 'NEW_MOVIE', value: JSON.stringify(movie) },
      ],
    });

    console.log('Filme enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar o filme:', error);
  } finally {
    await producer.disconnect();
    rl.close();
  }
};

run();
