import express from 'express';
import { parseSignal, saveSignal } from './services/signalsService.js';
import { saveDominance } from './services/coinstatsService.js'; // NÃO precisa parseDominance se não existir
import { logger } from './logger.js';

const router = express.Router();

// Sinais do TradingView
router.post('/signal', async (req, res, next) => {
  try {
    const sig = parseSignal(req.body);
    await saveSignal(sig);
    res.status(200).send('Signal received');
  } catch (err) {
    logger.error(err.stack || err);
    next(err);
  }
});

// Dominância (BTC.D)
router.post('/dominance', async (req, res, next) => {
  try {
    // Apenas salva direto, se não precisa parser
    await saveDominance(req.body);
    res.status(200).send('Dominance received');
  } catch (err) {
    logger.error(err.stack || err);
    next(err);
  }
});

export default router;
