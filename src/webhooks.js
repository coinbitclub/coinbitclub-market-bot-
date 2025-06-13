import express from 'express';
import { parseSignal } from './parseSignal.js';        // use o arquivo correto
import { saveSignal } from './signalsService.js';      // use o arquivo correto
import { parseDominance } from './parseDominance.js';  // use o arquivo correto
import { saveDominance } from './coinstatsService.js'; // use o arquivo correto
import { logger } from './logger.js';

const router = express.Router();

// Sinais do TradingView
router.post('/signal', async (req, res, next) => {
  try {
    console.log('RECEBIDO /signal:', req.body); // <-- loga no deploy para ver o que chega
    const sig = parseSignal(req.body);
    await saveSignal(sig);
    res.status(200).send('Signal received');
  } catch (err) {
    logger.error(err.stack || err);
    next(err);
  }
});

// Dominância BTC.D
router.post('/dominance', async (req, res, next) => {
  try {
    console.log('RECEBIDO /dominance:', req.body); // <-- loga no deploy para ver o que chega
    const dom = parseDominance(req.body);
    await saveDominance(dom);
    res.status(200).send('Dominance received');
  } catch (err) {
    logger.error(err.stack || err);
    next(err);
  }
});

export default router;
