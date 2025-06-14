import express from 'express';
import { parsesignal } from './services/parsesignal.js';
import { savesignal } from './services/signalsservice.js';
import { logger } from './utils/logger.js';
import { parsedominance, savedominance } from './services/parsedominance.js';

const router = express.Router();

router.post('/signal', async (req, res, next) => {
  try {
    console.log('SINAL RECEBIDO:', req.body);
    const sig = parsesignal(req.body);
    await savesignal(sig);
    res.status(200).send('Signal received');
  } catch (err) {
    logger.error(err.stack || err);
    next(err);
  }
});

router.post('/dominance', async (req, res, next) => {
  try {
    console.log('DOMINANCE RECEBIDA:', req.body);
    const dom = parsesominance(req.body);
    await savesominance(dom);
    res.status(200).send('Dominance received');
  } catch (err) {
    logger.error(err.stack || err);
    next(err);
  }
});

export default router;
