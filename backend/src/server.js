require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { types } = require('pg');
types.setTypeParser(1114, (str) => new Date(str + 'Z'));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/', (req, res) => {
  res.send('Servidor da estética automotiva funcionando!');
});

// ===== PRODUTOS =====

app.get('/produtos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM produtos ORDER BY id');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/produtos', async (req, res) => {
  try {
    const resultado = await pool.query(
      'INSERT INTO produtos (nome, tipo, quantidade_atual, estoque_minimo, fornecedor_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.body.nome, req.body.tipo, req.body.quantidade_atual, req.body.estoque_minimo, req.body.fornecedor_id]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/produtos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM produtos WHERE id = $1', [req.params.id]);
    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (err) {
    if (err.code === '23503') {
      res.status(400).json({ erro: 'Este produto possui movimentações registradas e não pode ser removido.' });
    } else {
      res.status(500).json({ erro: err.message });
    }
  }
});

// ===== CLIENTES =====

app.get('/clientes', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM clientes ORDER BY id');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/clientes', async (req, res) => {
  try {
    const resultado = await pool.query(
      'INSERT INTO clientes (nome, telefone) VALUES ($1, $2) RETURNING *',
      [req.body.nome, req.body.telefone]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/clientes/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM clientes WHERE id = $1', [req.params.id]);
    res.json({ mensagem: 'Cliente removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ===== VEÍCULOS =====

app.get('/veiculos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM veiculos ORDER BY id');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/veiculos', async (req, res) => {
  try {
    const resultado = await pool.query(
      'INSERT INTO veiculos (cliente_id, tipo, placa, modelo, cor) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.body.cliente_id, req.body.tipo, req.body.placa, req.body.modelo, req.body.cor]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/veiculos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM veiculos WHERE id = $1', [req.params.id]);
    res.json({ mensagem: 'Veiculo(s) removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.put('/veiculos/:id', async (req, res) => {
  try {
    const resultado = await pool.query(
      'UPDATE veiculos SET cliente_id = $1, tipo = $2, placa = $3, modelo = $4, cor = $5 WHERE id = $6 RETURNING *',
      [req.body.cliente_id, req.body.tipo, req.body.placa, req.body.modelo, req.body.cor, req.params.id]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ===== SERVIÇOS =====

app.get('/servicos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM servicos ORDER BY id');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/servicos', async (req, res) => {
  try {
    const resultado = await pool.query(
      'INSERT INTO servicos (nome, preco) VALUES ($1, $2) RETURNING *',
      [req.body.nome, req.body.preco]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/servicos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM servicos WHERE id = $1', [req.params.id]);
    res.json({ mensagem: 'Serviço removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.put('/servicos/:id', async (req, res) => {
  try {
    const resultado = await pool.query(
      'UPDATE servicos SET nome = $1, preco = $2 WHERE id = $3 RETURNING *',
      [req.body.nome, req.body.preco, req.params.id]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ===== ORDEM DE SERVIÇO =====

app.get('/ordem-servico', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM ordem_servico ORDER BY id');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/ordem-servico', async (req, res) => {
  try {
    const resultado = await pool.query(
      'INSERT INTO ordem_servico (veiculo_id, servico_id, valor, status, data_entrada) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [req.body.veiculo_id, req.body.servico_id, req.body.valor, req.body.status]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.put('/ordem-servico/:id', async (req, res) => {
  try {
    const resultado = await pool.query(
      'UPDATE ordem_servico SET veiculo_id = $1, servico_id = $2, valor = $3, status = $4, data_saida = NOW() WHERE id = $5 RETURNING *',
      [req.body.veiculo_id, req.body.servico_id, req.body.valor, req.body.status, req.params.id]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/ordem-servico/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ordem_servico WHERE id = $1', [req.params.id]);
    res.json({ mensagem: 'Ordem de serviço removida com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ===== DESPESAS =====
app.get('/despesas', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM despesas ORDER BY id');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/despesas', async (req, res) => {
  try {
    const resultado = await pool.query(
      'INSERT INTO despesas (descricao, categoria, valor) VALUES ($1, $2, $3) RETURNING *',
      [req.body.descricao, req.body.categoria, req.body.valor]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/despesas/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM despesas WHERE id = $1', [req.params.id]);
    res.json({ mensagem: 'Despesa removida com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get('/despesas/total', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT SUM(valor) AS despesas_total FROM despesas');
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ===== FATURAMENTO =====

app.get('/faturamento', async (req, res) => {
  try {
    const resultado = await pool.query("SELECT DATE_TRUNC('month', data_saida), SUM(valor) AS faturamento_total FROM ordem_servico WHERE status = 'concluído' GROUP BY DATE_TRUNC('month', data_saida)");
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get('/faturamento/dia', async (req, res) => {
  try {
    const resultado = await pool.query("SELECT DATE(data_saida), SUM(valor) AS faturamento_total FROM ordem_servico WHERE status = 'concluído' GROUP BY DATE(data_saida)");
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get('/faturamento/semana', async (req, res) => {
  try {
    const resultado = await pool.query("SELECT DATE_TRUNC('week', data_saida), SUM(valor) AS faturamento_total FROM ordem_servico WHERE status = 'concluído' GROUP BY DATE_TRUNC('week', data_saida)");
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ===== USO DE SERVIÇOS POR VEÍCULO =====

app.get('/uso-servicos', async (req, res) => {
  try {
    const resultado = await pool.query("SELECT veiculo_id, COUNT(*) AS total_servicos FROM ordem_servico WHERE status = 'concluído' GROUP BY veiculo_id");
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ===== MOVIMENTAÇÕES =====

app.post('/movimentacoes', async (req, res) => {
  try {
    const resultado = await pool.query(
      'INSERT INTO movimentacoes (produto_id, tipo, quantidade) VALUES ($1, $2, $3) RETURNING *',
      [req.body.produto_id, req.body.tipo, req.body.quantidade]
    );

    if (req.body.tipo === 'entrada') {
      await pool.query(
        'UPDATE produtos SET quantidade_atual = quantidade_atual + $1 WHERE id = $2',
        [req.body.quantidade, req.body.produto_id]
      );
    } else {
      await pool.query(
        'UPDATE produtos SET quantidade_atual = quantidade_atual - $1 WHERE id = $2',
        [req.body.quantidade, req.body.produto_id]
      );
    }

    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get('/movimentacoes', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM movimentacoes ORDER BY id');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.delete('/movimentacoes/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM movimentacoes WHERE id = $1', [req.params.id]);
    res.json({ mensagem: 'Movimentação removida com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});