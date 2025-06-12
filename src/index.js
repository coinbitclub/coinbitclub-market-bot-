import 'dotenv/config';
import express from 'express';
import { Pool } from 'pg';
import cron from 'node-cron';
import {
  getFearGreedIndexAndSave,
  getBTCDominanceAndSave
} from './services/coinstatsService.js';

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const SECRET = process.env.WEBHOOK_SECRET;
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Webhook de sinais de ativos (exemplo)
app.post('/webhook/signal', async (req, res) => {
  if (req.query.token !== SECRET) return res.status(401).json({ error: 'unauthorized' });
  try {
    console.log('Sinal recebido:', req.body);
    // TODO: gravar em `signals`, enviar ordens, etc.
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Erro /webhook/signal:', err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook de dominance BTC (exemplo)
app.post('/webhook/dominance', async (req, res) => {
  if (req.query.token !== SECRET) return res.status(401).json({ error: 'unauthorized' });
  console.log('Dominance recebido:', req.body);
  res.json({ status: 'ok' });
});

// Cron: Fear & Greed (coinsats) a cada hora
cron.schedule('0 * * * *', async () => {
  try {
    await getFearGreedIndexAndSave(pool);
    console.log('Fear & Greed gravado!');
  } catch (err) {
    console.error('Erro cron Fear & Greed:', err.message);
  }
});

// Cron: BTC Dominance a cada hora
cron.schedule('0 * * * *', async () => {
  try {
    await getBTCDominanceAndSave(pool);
    console.log('BTC Dominance gravado!');
  } catch (err) {
    console.error('Erro cron BTC Dominance:', err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 market-bot ouvindo na porta ${PORT}`);
});
