// market-bot/src/index.js
import 'dotenv/config';
import express from 'express';
import { Pool } from 'pg';
import cron from 'node-cron';
import {
  getFearGreedIndexAndSave,
  getBTCDominanceAndSave,
} from './coinstarsService.js';

const PORT = process.env.PORT ?? 3000;
const SECRET = process.env.WEBHOOK_SECRET;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

console.log('[ENV] COINSTATS_API_KEY:', process.env.COINSTATS_API_KEY);

const app = express();
app.use(express.json());

// Exemplo de webhook (ajuste según seu uso real)
app.post('/webhook/signal', async (req, res) => {
  if (req.query.token !== SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // TODO: gravar payload de sinais em sua tabela
  res.sendStatus(200);
});

app.post('/webhook/dominance', async (req, res) => {
  if (req.query.token !== SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // TODO: gravar payload de dominance em sua tabela
  res.sendStatus(200);
});

// Cron de CoinStats a cada hora
cron.schedule('0 * * * *', async () => {
  try {
    await getFearGreedIndexAndSave(pool);
    await getBTCDominanceAndSave(pool);
  } catch (err) {
    console.error('Erro no cron CoinStats:', err.message);
  }
});

app.listen(PORT, () =>
  console.log(`🚀 market-bot ouvindo na porta ${PORT}`)
);
