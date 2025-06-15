// src/routes/api.js
import express from 'express';
import axios   from 'axios';

const router = express.Router();
const KEY    = process.env.COINSTATS_API_KEY;

// 1) Fear & Greed
router.get('/fear-greed', async (_req, res) => {
  try {
    const { data } = await axios.get(
      'https://openapiv1.coinstats.app/insights/fear-and-greed',
      {
        headers: {
          accept: 'application/json',
          'X-API-KEY': KEY
        }
      }
    );
    return res.json({ status: 'ok', data });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 'error', message: err.message, details: err.response?.data });
  }
});

// 2) BTC Dominance (24h)
router.get('/btc-dominance', async (_req, res) => {
  try {
    const { data } = await axios.get(
      'https://openapiv1.coinstats.app/insights/btc-dominance?type=24h',
      {
        headers: {
          accept: 'application/json',
          'X-API-KEY': KEY
        }
      }
    );
    return res.json({ status: 'ok', data });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 'error', message: err.message, details: err.response?.data });
  }
});

// 3) Market Data
router.get('/market', async (_req, res) => {
  try {
    const { data } = await axios.get(
      'https://openapiv1.coinstats.app/markets',
      {
        headers: {
          accept: 'application/json',
          'X-API-KEY': KEY
        }
      }
    );
    return res.json({ status: 'ok', data });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 'error', message: err.message, details: err.response?.data });
  }
});

export default router;
