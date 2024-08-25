require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const connectToDb = async () => {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados PostgreSQL no Supabase');
    return client;
  } catch (err) {
    console.error('Erro ao conectar ao PostgreSQL', err);
    throw err;
  }
};

module.exports = connectToDb;
