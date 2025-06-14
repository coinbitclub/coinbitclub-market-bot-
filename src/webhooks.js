import express from 'express';
import { parseSignal } from './services/parseSignal.js';
import { saveSignal } from './services/signalsService.js';
import { logger } from './utils/logger.js';
import { parseDominance, saveDominance } from './services/parseDominance.js';

const router = express.Router();

router.post('/signal', async (req, res, next) => {
  try {
    console.log('SINAL RECEBIDO:', req.body);
    const sig = parseSignal(req.body);
    await saveSignal(sig);
    res.status(200).send('Signal received');
  } catch (err) {
    logger.error(err.stack || err);
    next(err);
  }
});

router.post('/dominance', async (req, res, next) => {
  try {
    console.log('DOMINANCE RECEBIDA:', req.body);
    const dom = parseDominance(req.body);
    await saveDominance(dom);
    res.status(200).send('Dominance received');
  } catch (err) {
    logger.error(err.stack || err);
    next(err);
  }
});

export default router;
