// market-bot/src/index.js
import 'dotenv/config';
import express from 'express';
import { Pool } from 'pg';
import cron from 'node-cron';
import {
  getFearGreedIndexAndSave,
  getBTCDominanceAndSave
} from './coinstarsService.js';

console.log('[ENV] COINSTATS_API_KEY:', process.env.COINSTATS_API_KEY);

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const SECRET = process.env.WEBHOOK_SECRET;
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

// Webhook de sinais (setup)
app.post('/webhook/signal', async (req, res) => {
  if (req.query.token !== SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  try {
    await pool.query(
      `INSERT INTO signals (received_at, raw_payload) VALUES (NOW(), $1)`,
      [JSON.stringify(req.body)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook de dominância BTC
app.post('/webhook/dominance', async (req, res) => {
  if (req.query.token !== SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  try {
    await pool.query(
      `INSERT INTO dominance_signals (received_at, raw_payload) VALUES (NOW(), $1)`,
      [JSON.stringify(req.body)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoints manuais
app.get('/api/fear-greed', async (_req, res) => {
  try {
    const data = await getFearGreedIndexAndSave(pool);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/btc-dominance', async (_req, res) => {
  try {
    const data = await getBTCDominanceAndSave(pool);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Cron a cada 30 minutos
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
  console.log(`🚀 market-bot ouvindo na porta ${PORT}`);
});
