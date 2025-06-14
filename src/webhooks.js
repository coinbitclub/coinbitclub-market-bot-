import express from 'express';
import { parseSignal } from './signals.js';
import { saveSignal } from './services/signalsService.js';
import { parseDominance, saveDominance } from './services/coinstatsService.js';
import { logger } from './logger.js';
import { parseDominance, saveDominance } from './services/parseDominance.js';

const router = express.Router();

// Sinal do TradingView
router.post('/signal', async (req, res, next) => {
  try {
    console.log('SINAL RECEBIDO:', req.body); // <-- DEBUG
    const sig = parseSignal(req.body);
    await saveSignal(sig);
    res.status(200).send('Signal received');
  } catch (err) {
    logger.error(err.stack || err);
    next(err);
  }
});

// Dominância do TradingView
router.post('/dominance', async (req, res, next) => {
  try {
    console.log('DOMINANCE RECEBIDA:', req.body); // <-- DEBUG
    const dom = parseDominance(req.body);
    await saveDominance(dom);
    res.status(200).send('Dominance received');
  } catch (err) {
    logger.error(err.stack || err);
    next(err);
  }
});

export default router;





