import express from 'express';
import { saveSignal } from '../services/signalsService.js';
import { saveDominance } from '../services/dominanceService.js';

const router = express.Router();

// Recebe sinais do TradingView
router.post('/signal', async (req, res) => {
  try {
    const { token } = req.query;
    if (token !== process.env.WEBHOOK_TOKEN) return res.status(401).json({ error: 'Token inválido' });
    await saveSignal(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erro no /signal:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Recebe dominance do TradingView
router.post('/dominance', async (req, res) => {
  try {
    const { token } = req.query;
    if (token !== process.env.WEBHOOK_TOKEN) return res.status(401).json({ error: 'Token inválido' });
    await saveDominance(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erro no /dominance:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
