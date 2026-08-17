require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const comandosSQL = `
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS veiculos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id),
  tipo VARCHAR(30),
  placa VARCHAR(10),
  modelo VARCHAR(50),
  cor VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS servicos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS ordem_servico (
  id SERIAL PRIMARY KEY,
  veiculo_id INTEGER REFERENCES veiculos(id),
  servico_id INTEGER REFERENCES servicos(id),
  data_entrada TIMESTAMP,
  data_saida TIMESTAMP,
  valor DECIMAL(10,2),
  status VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS fornecedores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  contato VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(50),
  quantidade_atual INTEGER DEFAULT 0,
  estoque_minimo INTEGER DEFAULT 0,
  fornecedor_id INTEGER REFERENCES fornecedores(id)
);

CREATE TABLE IF NOT EXISTS movimentacoes (
  id SERIAL PRIMARY KEY,
  produto_id INTEGER REFERENCES produtos(id),
  tipo VARCHAR(10),
  quantidade INTEGER,
  data TIMESTAMP DEFAULT NOW()
);
`;

pool.query(comandosSQL)
  .then(() => {
    console.log('Tabelas criadas com sucesso!');
    pool.end();
  })
  .catch((err) => {
    console.error('Erro ao criar tabelas:', err.message);
    pool.end();
  });