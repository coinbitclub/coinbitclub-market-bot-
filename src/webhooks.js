import { Router } from 'express';
import { saveSignal } from './services/signalsService.js';
import { saveDominance } from './services/coinstatsService.js';

const router = new Router();

// Recebe sinal completo (vindo do TradingView)
router.post('/signal', async (req, res, next) => {
  try {
    await saveSignal(req.body);
    return res.status(200).send('Signal received');
  } catch (err) {
    next(err);
  }
});

// Recebe dominance BTC (vindo do TradingView)
router.post('/dominance', async (req, res, next) => {
  try {
    await saveDominance(req.body);
    return res.status(200).send('Dominance received');
  } catch (err) {
    next(err);
  }
});

export default router;
