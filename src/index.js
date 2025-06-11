import 'dotenv/config'; // Importação direta
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();

app.use(express.json());

// Configuração da conexão PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL // (use variável do Railway)
});

// Endpoint para receber sinais do TradingView
app.post('/webhook/signal', async (req, res) => {
  try {
    const payload = req.body;
    // Grava o payload bruto na tabela signals
    await pool.query(
      `INSERT INTO signals (received_at, raw_payload) VALUES (NOW(), $1)`,
      [JSON.stringify(payload)]
    );
    res.status(200).json({ success: true, message: 'Sinal recebido e salvo.' });
  } catch (err) {
    console.error('Erro ao salvar sinal:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
