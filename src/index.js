// market-bot/src/index.js
import 'dotenv/config';
import express       from 'express';
import { Pool }      from 'pg';
import cron          from 'node-cron';
import {
  getFearGreedIndexAndSave,
  getBTCDominanceAndSave
} from './coinstarsService.js';

console.log('[ENV] COINSTATS_API_KEY:', process.env.COINSTATS_API_KEY?.trim());

const app    = express();
const pool   = new Pool({ connectionString: process.env.DATABASE_URL });
const SECRET = process.env.WEBHOOK_SECRET;
const PORT   = process.env.PORT || 3000;

app.use(express.json());

// 1) Webhook sinais de setup
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
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2) Webhook dominância BTC
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
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3) Consulta manual Fear & Greed
app.get('/api/fear-greed', async (req, res) => {
  try {
    const data = await getFearGreedIndexAndSave(pool);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4) Consulta manual BTC Dominance
app.get('/api/btc-dominance', async (req, res) => {
  try {
    const data = await getBTCDominanceAndSave(pool);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5) Agendamento a cada 30'
cron.schedule('*/30 * * * *', async () => {
  try {
    await getFearGreedIndexAndSave(pool);
    await getBTCDominanceAndSave(pool);
    console.log('CoinStats: Dados salvos automaticamente');
  } catch (err) {
    console.error('Erro ao salvar dados CoinStats:', err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 market-bot rodando na porta ${PORT}`);
});
