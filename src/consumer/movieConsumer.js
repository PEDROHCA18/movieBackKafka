const { Client } = require('pg');
const kafka = require('../config/kafkaConfig');
const consumer = kafka.consumer({ groupId: 'movie-group' });

// Configurações do banco de dados
const dbClient = new Client({
  connectionString: 'postgresql://postgres.eilsmoynodomolzbnmrz:piedro1880301@aws-0-sa-east-1.pooler.supabase.com:6543/postgres',
});

const run = async () => {
  await dbClient.connect(); // Conectar ao banco de dados

  await consumer.connect();
  await consumer.subscribe({ topic: 'NEW_MOVIES', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const movie = JSON.parse(message.value.toString());
      console.log('Recebendo novo filme:', movie);

      // Adiciona o filme ao banco de dados
      try {
        await dbClient.query(
          'INSERT INTO movies (title, director, release_year) VALUES ($1, $2, $3)',
          [movie.title, movie.director, movie.releaseYear]
        );
        console.log('Filme inserido no banco de dados com sucesso.');
      } catch (error) {
        console.error('Erro ao inserir filme no banco de dados:', error);
      }
    },
  });
};

// Função para listar todos os filmes
const listMovies = async () => {
  try {
    const result = await dbClient.query('SELECT * FROM movies');
    return result.rows;
  } catch (error) {
    console.error('Erro ao listar filmes:', error);
    throw error;
  }
};

// Executar a função listMovies para teste
const testListMovies = async () => {
  try {
    const movies = await listMovies();
    console.log('Filmes no banco de dados:', movies);
  } catch (error) {
    console.error('Erro ao listar filmes:', error);
  }
};

run().catch(console.error);
testListMovies();
