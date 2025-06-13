/* ========== src/webhooks.js ========== */
import express from 'express';
import { parseSignal }   from './signals.js';
import { saveSignal }    from './services/signalsService.js';
import { saveDominance } from './services/coinstatsService.js';
import { logger }         from './logger.js';

const router = express.Router();

// Recebe os alertas do TradingView (sinais de entrada/saída)
router.post('/signal', async (req, res, next) => {
  try {
    const signal = parseSignal(req.body);
    await saveSignal(signal);
    res.status(200).send('Signal received');
  } catch (err) {
    logger.error(err.stack ?? err);
    next(err);
  }
});

// Recebe o webhook de dominância (BTC.D)
router.post('/dominance', async (req, res, next) => {
  try {
    await saveDominance(req.body);
    res.status(200).send('Dominance received');
  } catch (err) {
    logger.error(err.stack ?? err);
    next(err);
  }
});

export default router;
