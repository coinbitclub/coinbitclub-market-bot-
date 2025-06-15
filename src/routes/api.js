import express from 'express';
import axios from 'axios';

const router = express.Router();
const BASE = 'https://openapiv1.coinstats.app/insights';

// 1. Fear & Greed Index
router.get('/fear-greed', async (_req, res) => {
  try {
    const { data } = await axios.get(`${BASE}/fear-and-greed`);
    res.json({ status: 'ok', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 2. BTC Dominance
router.get('/btc-dominance', async (_req, res) => {
  try {
    const { data } = await axios.get(`${BASE}/btc-dominance`);
    res.json({ status: 'ok', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 3. Market
router.get('/market', async (_req, res) => {
  try {
    const { data } = await axios.get(`${BASE}/market`);
    res.json({ status: 'ok', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
