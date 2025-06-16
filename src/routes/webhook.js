import express from 'express';
import { parseSignal } from '../parseSignal.js';
import { saveSignal } from '../services/signalsService.js';

const router = express.Router();

router.post('/signal', async (req, res) => {
  try {
    const token = req.query.token;
    if (token !== process.env.WEBHOOK_TOKEN) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    const signal = parseSignal(req.body);
    await saveSignal(signal);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/signal', async (req, res) => {
  try {
    const token = req.query.token;
    if (token !== process.env.WEBHOOK_TOKEN) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    const signal = parseSignal(req.query);
    await saveSignal(signal);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
