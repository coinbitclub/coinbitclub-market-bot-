// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import './coinstatsCron.js'; // dispara o cron em background
import db from './databaseService.js';

dotenv.config();
const app = express();
app.use(express.json());

app.get('/api/btc-dominance', async (_, res) => {
  const { rows } = await db.query(
    `SELECT raw_payload FROM coinstats_btc_dominance ORDER BY received_at DESC LIMIT 1`
  );
  res.json(rows[0]?.raw_payload ?? {});
});

app.get('/api/fear-greed', async (_, res) => {
  const { rows } = await db.query(
    `SELECT raw_payload FROM coinstats_fear_greed ORDER BY received_at DESC LIMIT 1`
  );
  res.json(rows[0]?.raw_payload ?? {});
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`🚀 market-bot listening on port ${port}`));
