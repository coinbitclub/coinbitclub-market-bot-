import express from 'express';
import axios from 'axios';

const router = express.Router();

const COINSTATS_API_KEY = process.env.COINSTATS_API_KEY;

// BTC Dominance (24h)
router.get('/btc-dominance', async (req, res) => {
  try {
    console.log('Recebida request /btc-dominance', req.query);
    const { token } = req.query;
    if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
      console.log('Token inválido');
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
    console.log('CoinStats Dominance response:', data);
    res.json({ status: 'ok', data });
  } catch (err) {
    console.error('Erro /btc-dominance', err.response?.status, err.response?.data, err.message);
    res.status(500).json({ status: 'error', message: err.message, details: err.response?.data });
  }
});

// Fear and Greed Index
router.get('/fear-greed', async (req, res) => {
  try {
    console.log('Recebida request /fear-greed', req.query);
    const { token } = req.query;
    if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
      console.log('Token inválido');
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
    console.log('CoinStats Fear-Greed response:', data);
    res.json({ status: 'ok', data });
  } catch (err) {
    console.error('Erro /fear-greed', err.response?.status, err.response?.data, err.message);
    res.status(500).json({ status: 'error', message: err.message, details: err.response?.data });
  }
});

// Market data
router.get('/market', async (req, res) => {
  try {
    console.log('Recebida request /market', req.query);
    const { token } = req.query;
    if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
      console.log('Token inválido');
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
    console.log('CoinStats Market response:', data);
    res.json({ status: 'ok', data });
  } catch (err) {
    console.error('Erro /market', err.response?.status, err.response?.data, err.message);
    res.status(500).json({ status: 'error', message: err.message, details: err.response?.data });
  }
});

export default router;
