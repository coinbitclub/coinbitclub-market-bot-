// market-bot/src/index.js
import express from 'express';
import { Pool } from 'pg';
import cron from 'node-cron';
import {
  getFearGreedIndexAndSave,
  getBTCDominanceAndSave
} from './coinstarsService.js';

console.log('[ENV] COINSTATS_API_KEY:', process.env.COINSTATS_API_KEY);

const app    = express();
const pool   = new Pool({ connectionString: process.env.DATABASE_URL });
const SECRET = process.env.WEBHOOK_SECRET;
const PORT   = process.env.PORT || 3000;

app.use(express.json());

// Webhook para sinais de moedas/setup
app.post('/webhook/signal', async (req, res) => {
  if (req.query.token !== SECRET) return res.status(401).json({ error: "unauthorized" });
  try {
    await pool.query(
      `INSERT INTO signals (received_at, raw_payload) VALUES (NOW(), $1)`,
      [JSON.stringify(req.body)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Webhook para sinais de dominância BTC.D
app.post('/webhook/dominance', async (req, res) => {
  if (req.query.token !== SECRET) return res.status(401).json({ error: "unauthorized" });
  try {
    await pool.query(
      `INSERT INTO dominance_signals (received_at, raw_payload) VALUES (NOW(), $1)`,
      [JSON.stringify(req.body)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Consulta manual Fear & Greed
app.get('/api/fear-greed', async (req, res) => {
  try {
    const fg = await getFearGreedIndexAndSave(pool);
    res.json(fg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Consulta manual BTC Dominance
app.get('/api/btc-dominance', async (req, res) => {
  try {
    const dominance = await getBTCDominanceAndSave(pool);
    res.json(dominance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Agendamento automático a cada 30 minutos
cron.schedule('*/30 * * * *', async () => {
  try {
    await getFearGreedIndexAndSave(pool);
    await getBTCDominanceAndSave(pool);
    console.log('CoinStats: Dados salvos automaticamente');
  } catch (e) {
    console.error('Erro ao salvar dados CoinStats:', e.message);
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
