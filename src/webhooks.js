import express from 'express';
import { parseSignal } from './services/parseSignal.js';
import { saveSignal } from './services/signalsService.js';
import { logger } from './utils/logger.js';
import { parseDominance, saveDominance } from './services/parseDominance.js';

const router = express.Router();

router.post('/signal', async (req, res, next) => {
  try {
    logger.info('[webhook/signal] Payload recebido:', req.body);
    const sig = parseSignal(req.body);
    await saveSignal(sig);
    res.status(200).json({ status: 'ok', message: 'Signal received' });
  } catch (err) {
    logger.error('[webhook/signal] Erro:', err.stack || err);
    res.status(500).json({ status: 'error', message: err.message });
    // next(err); // Se preferir usar o error handler global, deixe essa linha.
  }
});

router.post('/dominance', async (req, res, next) => {
  try {
    logger.info('[webhook/dominance] Payload recebido:', req.body);
    const dom = parseDominance(req.body);
    await saveDominance(dom);
    res.status(200).json({ status: 'ok', message: 'Dominance received' });
  } catch (err) {
    logger.error('[webhook/dominance] Erro:', err.stack || err);
    res.status(500).json({ status: 'error', message: err.message });
    // next(err);
  }
});

export default router;
