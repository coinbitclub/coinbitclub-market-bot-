import express from 'express';
import axios from 'axios';

const router = express.Router();

const COINSTATS_API_KEY = process.env.COINSTATS_API_KEY;

// BTC Dominance (24h)
router.get('/btc-dominance', async (req, res) => {
  try {
    const { token } = req.query;
    if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    const { data } = await axios.get(
      'https://openapiv1.coinstats.app/insights/btc-dominance?type=24h',
      {
        headers: {
          'accept': 'application/json',
          'X-API-KEY': COINSTATS_API_KEY
        }
      }
    );
    res.json({ status: 'ok', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Fear and Greed Index
router.get('/fear-greed', async (req, res) => {
  try {
    const { token } = req.query;
    if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    const { data } = await axios.get(
      'https://openapiv1.coinstats.app/insights/fear-and-greed',
      {
        headers: {
          'accept': 'application/json',
          'X-API-KEY': COINSTATS_API_KEY
        }
      }
    );
    res.json({ status: 'ok', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Market data
router.get('/market', async (req, res) => {
  try {
    const { token } = req.query;
    if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    const { data } = await axios.get(
      'https://openapiv1.coinstats.app/markets',
      {
        headers: {
          'accept': 'application/json',
          'X-API-KEY': COINSTATS_API_KEY
        }
      }
    );
    res.json({ status: 'ok', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
