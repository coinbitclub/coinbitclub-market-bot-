import express from 'express';
import { parseSignal }     from './signals.js';
import { saveSignal }      from './services/signalsService.js';
import { saveDominance }   from './services/coinstatsService.js';
import { logger }          from './logger.js';

const router = express.Router();

router.post('/signal', async (req, res, next) => {
  try {
    const signal = parseSignal(req.body);
    await saveSignal(signal);
    return res.status(200).send('Signal received');
  } catch (err) {
    logger.error(err.stack);
    next(err);
  }
});

router.post('/dominance', async (req, res, next) => {
  try {
    await saveDominance(req.body);
    return res.status(200).send('Dominance received');
  } catch (err) {
    logger.error(err.stack);
    next(err);
  }
});

export default router;
