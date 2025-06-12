import express from 'express';
import dotenv from 'dotenv';
import { startCoinstatsCron } from './coinstatsCron.js';
import {
  getLatestFearGreed,
  getLatestBTCDominance
} from './databaseService.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// inicia o cron assim que o app sobe
startCoinstatsCron();

// rotas expostas
app.get('/api/fear-greed', async (req, res) => {
  try {
    const payload = await getLatestFearGreed();
    if (!payload) return res.status(404).json({ error: 'Nenhum dado cadastrado ainda.' });
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/btc-dominance', async (req, res) => {
  try {
    const payload = await getLatestBTCDominance();
    if (!payload) return res.status(404).json({ error: 'Nenhum dado cadastrado ainda.' });
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 market-bot ouvindo na porta ${PORT}`);
});
