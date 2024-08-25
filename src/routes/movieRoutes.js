// src/routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const kafka = require('../config/kafkaConfig');
const producer = kafka.producer();

router.post('/api/movies', async (req, res) => {
  const { title, director, releaseYear } = req.body;

  if (!title || !director || !releaseYear) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    await producer.connect();

    await producer.send({
      topic: 'NEW_MOVIES',
      messages: [
        { key: 'NEW_MOVIE', value: JSON.stringify({ title, director, releaseYear }) },
      ],
    });

    await producer.disconnect();
    res.status(200).json({ message: 'Filme adicionado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar mensagem para o Kafka:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


module.exports = router;
