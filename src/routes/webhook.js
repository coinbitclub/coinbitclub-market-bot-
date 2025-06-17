import express from 'express';
import { saveSignal } from '../services/signalsService.js';
import { saveDominance } from '../services/parseDominance.js';

const router = express.Router();

router.post('/signal', async (req, res) => {
  try {
    await saveSignal(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar sinal' });
  }
});

router.post('/dominance', async (req, res) => {
  try {
    await saveDominance(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar dominance' });
  }
});

export default router;
