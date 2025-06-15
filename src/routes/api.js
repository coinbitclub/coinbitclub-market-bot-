import express from 'express';
import { executeQuery } from '../services/databaseService.js';

const router = express.Router();

// 1) Latest Fear & Greed
router.get('/fear-greed', async (_req, res) => {
  const rows = await executeQuery(
    `SELECT captured_at, index_value
       FROM fear_greed
      ORDER BY captured_at DESC
      LIMIT 1`
  );
  res.json({ status: 'ok', data: rows[0] || null });
});

// 2) Latest BTC Dominance
router.get('/btc-dominance', async (_req, res) => {
  const rows = await executeQuery(
    `SELECT captured_at, dominance
       FROM btc_dominance
      ORDER BY captured_at DESC
      LIMIT 1`
  );
  res.json({ status: 'ok', data: rows[0] || null });
});

// 3) Latest Market Metrics
router.get('/market', async (_req, res) => {
  const rows = await executeQuery(
    `SELECT captured_at, market_cap, volume_24h
       FROM market_metrics
      ORDER BY captured_at DESC
      LIMIT 1`
  );
  res.json({ status: 'ok', data: rows[0] || null });
});

export default router;
