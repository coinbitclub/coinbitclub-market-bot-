import express from 'express';
import { saveSignal } from '../services/signalsService.js';
// ... (demais imports caso precise)

const router = express.Router();

// GET /webhook/signal
router.get('/signal', (req, res) => {
  res.json({ msg: 'GET /webhook/signal funcionando' });
});

// POST /webhook/signal
router.post('/signal', async (req, res) => {
  try {
    const result = await saveSignal(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar signal' });
  }
});

export default router;
