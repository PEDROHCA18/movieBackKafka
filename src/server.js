const express = require('express');
const { Pool } = require('pg');
const kafka = require('./config/kafkaConfig');
const producer = kafka.producer();

const app = express();
const port = 3000;

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'aws-0-sa-east-1.pooler.supabase.com',
  database: 'postgres',
  password: 'piedro1880301',
  port: 6543,
});

app.use(express.json());

// Rota para adicionar um filme
app.post('/add-movie', async (req, res) => {
  const { title, director, releaseYear } = req.body;

  try {
    // Enviar mensagem para o Kafka
    await producer.connect();
    await producer.send({
      topic: 'NEW_MOVIES',
      messages: [
        { key: 'NEW_MOVIE', value: JSON.stringify({ title, director, releaseYear }) },
      ],
    });
    await producer.disconnect();

    res.status(200).send('Filme enviado para Kafka com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar filme para Kafka:', error);
    res.status(500).send('Erro ao adicionar filme.');
  }
});

// Rota para iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor Express rodando na porta ${port}`);
});
