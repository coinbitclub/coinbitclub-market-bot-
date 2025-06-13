import express from 'express';
import { parseSignal, saveSignal } from './services/signalsService.js';
import { parseDominance, saveDominance } from './services/coinstatsService.js';
import { logger } from './logger.js';

const router = express.Router();

// Sinais do TradingView
router.post('/signal', async (req, res, next) => {
  try {
    // Debug: veja exatamente o que está chegando!
    console.log('Payload recebido em /signal:', req.body);

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
    // Debug: veja exatamente o que está chegando!
    console.log('Payload recebido em /dominance:', req.body);

    const dom = parseDominance(req.body);
    await saveDominance(dom);
    res.status(200).send('Dominance received');
  } catch (err) {
    logger.error(err.stack || err);
    next(err);
  }
});

export default router;
