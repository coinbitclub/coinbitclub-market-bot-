import express from 'express';
import { saveSignal } from '../services/signalsService.js';
import { saveDominance } from '../services/dominanceService.js';

const router = express.Router();

router.post('/signal', async (req, res) => {
  try {
    await saveSignal(req.body);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/dominance', async (req, res) => {
  try {
    await saveDominance(req.body);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
