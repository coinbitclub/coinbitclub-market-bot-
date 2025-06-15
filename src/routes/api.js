import express from 'express';
import axios from 'axios';

const router = express.Router();

const API_KEY = 'ZFIxigBcVaCyXDL1Qp/Ork7TOL3+h07NM2f3YoSrMkI=';

// Endpoints reais Coinstars:
const FEAR_GREED_URL = `https://openapi1.coinstars.app/fear_greed?apiKey=${API_KEY}`;
const BTC_DOMINANCE_URL = `https://openapi1.coinstars.app/btc_dominance?apiKey=${API_KEY}`;
const MARKET_URL = `https://openapi1.coinstars.app/markets?apiKey=${API_KEY}`;

// Fear & Greed Index
router.get('/fear-greed', async (_req, res) => {
  try {
    const response = await axios.get(FEAR_GREED_URL);
    res.json({ status: 'ok', data: response.data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// BTC Dominance
router.get('/btc-dominance', async (_req, res) => {
  try {
    const response = await axios.get(BTC_DOMINANCE_URL);
    res.json({ status: 'ok', data: response.data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Market (métricas globais)
router.get('/market', async (_req, res) => {
  try {
    const response = await axios.get(MARKET_URL);
    res.json({ status: 'ok', data: response.data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
