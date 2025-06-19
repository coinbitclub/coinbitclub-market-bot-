// src/routes/webhook.js
import { Router } from 'express';
import logger from '../utils/logger.js';
import { parseSignal } from '../parseSignal.js';
import { saveSignal } from '../services/signalsService.js';
import { parseDominance } from '../parseDominance.js';
import { saveDominance } from '../services/dominanceService.js';

const router = Router();

// extrai o userId (se houver)
router.use((req, _res, next) => {
  req.userId = req.query.userId || (req.user && req.user.id) || null;
  next();
});

router.post('/signal', async (req, res, next) => {
  try {
    const raw = req.body.trim();
    logger.info('[raw webhook/signal]', raw);
    const signal = parseSignal(raw);
    await saveSignal(req.userId, signal);
    return res.json({ status: 'ok' });
  } catch (err) {
    logger.error('Signal handler error', err);
    return res.status(500).json({ error: 'Signal processing failed' });
  }
});

router.post('/dominance', async (req, res, next) => {
  try {
    const raw = req.body.trim();
    logger.info('[raw webhook/dominance]', raw);
    const dom = parseDominance(raw);
    await saveDominance(req.userId, dom);
    return res.json({ status: 'ok' });
  } catch (err) {
    logger.error('Dominance handler error', err);
    return res.status(500).json({ error: 'Dominance processing failed' });
  }
});

export default router;
