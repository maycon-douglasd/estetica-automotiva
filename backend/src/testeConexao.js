require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar:', err.message);
  } else {
    console.log('Conectado com sucesso! Hora do banco:', res.rows[0].now);
  }
  pool.end();
});