// coinbitclub_bot/src/index.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cron = require('node-cron');
const {
  getFearGreedIndexAndSave,
  getBTCDominanceAndSave
} = require('./services/coinstarsService');

console.log('[ENV] COINSTATS_API_KEY:', process.env.COINSTATS_API_KEY);

const app    = express();
const pool   = new Pool({ connectionString: process.env.DATABASE_URL });
const SECRET = process.env.WEBHOOK_SECRET;
const PORT   = process.env.PORT || 8080;

app.use(express.json());

// Webhook sinais de setup
app.post('/webhook/signal', async (req, res) => {
  if (req.query.token !== SECRET) return res.status(401).json({ error: 'unauthorized' });
  try {
    await pool.query(
      `INSERT INTO signals (received_at, raw_payload) VALUES (NOW(), $1)`,
      [ JSON.stringify(req.body) ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook dominância BTC
app.post('/webhook/dominance', async (req, res) => {
  if (req.query.token !== SECRET) return res.status(401).json({ error: 'unauthorized' });
  try {
    await pool.query(
      `INSERT INTO dominance_signals (received_at, raw_payload) VALUES (NOW(), $1)`,
      [ JSON.stringify(req.body) ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Consulta manual Fear & Greed
app.get('/api/fear-greed', async (req, res) => {
  try {
    const data = await getFearGreedIndexAndSave(pool);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Consulta manual BTC Dominance
app.get('/api/btc-dominance', async (req, res) => {
  try {
    const data = await getBTCDominanceAndSave(pool);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Agendamento a cada 30 minutos
cron.schedule('*/30 * * * *', async () => {
  try {
    await getFearGreedIndexAndSave(pool);
    await getBTCDominanceAndSave(pool);
    console.log('CoinStats: dados salvos automaticamente');
  } catch (err) {
    console.error('Erro no cron CoinStats:', err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 coinbitclub_bot ouvindo na porta ${PORT}`);
});
