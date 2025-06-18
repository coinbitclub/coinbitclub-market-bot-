// src/routes/webhook.js
import express from 'express';
import { parseSignal } from '../parseSignal.js';
import { saveSignal } from '../services/signalsService.js';
import { parseDominance } from '../parseDominance.js';
import { saveDominance } from '../services/dominanceService.js';

const router = express.Router();

// Middleware: extrai userId de JWT ou query
router.use((req, _res, next) => {
  req.userId = req.query.userId || (req.user && req.user.id);
  next();
});

router.post('/signal', async (req, res, next) => {
  try {
    // 1) Log raw
    console.log('[raw webhook/signal]', req.body);
    // 2) Parse e salva
    const signal = parseSignal(req.body);
    await saveSignal(req.userId, signal);
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
});

router.post('/dominance', async (req, res, next) => {
  try {
    console.log('[raw webhook/dominance]', req.body);
    const dom = parseDominance(req.body);
    await saveDominance(req.userId, dom);
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
});

export default router;
