import express from 'express';
import dotenv from 'dotenv';
import * as coinstatsCron from './coinstatsCron.js';
import scheduler from './jobs/scheduler.js';
import { getLatestFearGreed, getLatestBTCDominance } from './services/signalsService.js';

dotenv.config();
const app = express();
app.use(express.json());

// Health
app.get('/', (req, res) => res.send('market-bot running'));

// Debug endpoints
app.get('/api/fear-greed', async (req, res) => {
  const data = await getLatestFearGreed();
  res.json(data);
});
app.get('/api/btc-dominance', async (req, res) => {
  const data = await getLatestBTCDominance();
  res.json(data);
});

// Inicia cron CoinStats (F&G e BTC Dominance)
coinstatsCron.startAll();

// Inicia scheduler interno (signals, orders, etc)
scheduler();

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`🚀 market-bot listening on port ${port}`));
