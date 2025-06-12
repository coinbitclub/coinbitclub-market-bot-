// src/index.js
import 'dotenv/config';
import express from 'express';
import { fetchFearGreed, fetchBTCDominance } from './services/coinstatsService.js';

const app = express();
const PORT = process.env.PORT || 8080;

// rota de health-check
app.get('/', (_req, res) => res.send('market-bot OK'));

// rota pública para Fear & Greed
app.get('/api/fear-greed', async (_req, res) => {
  try {
    const data = await fetchFearGreed();
    res.json(data);
  } catch (err) {
    console.error('[CoinStats] /api/fear-greed error:', err.message);
    res.status(502).json({ error: 'Failed to fetch Fear & Greed' });
  }
});

// rota pública para BTC Dominance
app.get('/api/btc-dominance', async (_req, res) => {
  try {
    const data = await fetchBTCDominance();
    res.json(data);
  } catch (err) {
    console.error('[CoinStats] /api/btc-dominance error:', err.message);
    res.status(502).json({ error: 'Failed to fetch BTC Dominance' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 market-bot listening on port ${PORT}`);
});
