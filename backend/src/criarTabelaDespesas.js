require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const comandoSQL = `
CREATE TABLE IF NOT EXISTS despesas (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data TIMESTAMP DEFAULT NOW()
);
`;

pool.query(comandoSQL)
  .then(() => {
    console.log('Tabela despesas criada com sucesso!');
    pool.end();
  })
  .catch((err) => {
    console.error('Erro ao criar tabela:', err.message);
    pool.end();
  });