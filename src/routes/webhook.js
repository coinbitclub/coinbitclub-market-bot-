// src/routes/webhook.js
import { Router } from 'express';
import { saveSignal } from '../services/signalsService.js';
import { saveDominance } from '../services/dominanceService.js';
import { saveRaw } from '../services/rawService.js';
import { parseSignal } from '../parseSignal.js';
import { parseDominance } from '../parseDominance.js';
import { logger } from '../logger.js';

const router = Router();

// 1) Autenticação por token (query string)
router.use((req, res, next) => {
  const token = req.query.token;
  if (token !== process.env.WEBHOOK_TOKEN) {
    logger.warn('Token inválido no webhook', { token });
    return res.status(401).json({ error: 'Token inválido' });
  }
  next();
});

// 2) Auditoria: grava o JSON bruto em raw_webhook
router.use(async (req, res, next) => {
  try {
    await saveRaw(req.path, { ...(req.query || {}), ...(req.body || {}) });
  } catch (e) {
    // falha em raw não interrompe o fluxo
    logger.warn('Falha ao gravar raw_webhook', e);
  }
  next();
});

// 3) GET /webhook/signal — ex: Coinstars
router.get('/signal', async (req, res) => {
  logger.info('Recebido GET /signal', { query: req.query });
  try {
    const signal = parseSignal(req.query);
    await saveSignal(signal);
    res.json({ status: 'ok' });
  } catch (err) {
    logger.error('Erro no GET /signal', err);
    res.status(500).json({ error: 'Erro ao processar GET' });
  }
});

// 4) POST /webhook/signal — ex: TradingView
router.post('/signal', async (req, res) => {
  logger.info('Recebido POST /signal', { body: req.body });
  try {
    const signal = parseSignal(req.body);
    await saveSignal(signal);
    res.json({ status: 'ok' });
  } catch (err) {
    logger.error('Erro no POST /signal', err);
    res.status(500).json({ error: 'Erro ao processar POST' });
  }
});

// 5) POST /webhook/dominance — opcional
router.post('/dominance', async (req, res) => {
  logger.info('Recebido POST /dominance', { body: req.body });
  try {
    const dom = parseDominance(req.body);
    await saveDominance(dom);
    res.json({ status: 'ok' });
  } catch (err) {
    logger.error('Erro no POST /dominance', err);
    res.status(500).json({ error: 'Erro ao processar dominância' });
  }
});

export default router;
