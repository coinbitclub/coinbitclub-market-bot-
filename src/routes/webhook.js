import express from 'express';
import { saveSignal } from '../services/signalsService.js';

const router = express.Router();

// POST /webhook/signal
router.post('/signal', async (req, res) => {
  try {
    const data = req.body;
    // Aceita time em ISO ou timestamp numérico
    if (typeof data.time === 'string' && !isNaN(Date.parse(data.time))) {
      data.time = new Date(data.time);
    } else if (typeof data.time === 'number') {
      data.time = new Date(data.time * 1000);
    }
    await saveSignal(data);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook POST error', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /webhook/signal
router.get('/signal', async (req, res) => {
  res.status(200).json({ msg: 'GET /webhook/signal working' });
});

export default router;
