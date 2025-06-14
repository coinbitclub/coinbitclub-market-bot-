// src/routes/signals.js
import express from 'express';
import { saveSignal } from '../services/signalsService.js';
const router = express.Router();

router.post('/signal', async (req, res) => {
  try {
    await saveSignal(req.body);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save signal.' });
  }
});

export default router;
