import express from 'express';
import { parseSignal } from './services/parseSignal.js';
import { saveSignal } from './services/signalsService.js';
import { logger } from './utils/logger.js';
import { parseDominance, saveDominance } from './services/parseDominance.js';

const router = express.Router();

// ========== SIGNAL ==========
router.post('/signal', async (req, res) => {
  try {
    logger.info('[webhook/signal] Payload recebido:', req.body);

    // DEBUG 1: Só responde (comente as linhas abaixo para isolar erro)
    // return res.status(200).json({ status: 'ok', received: req.body });

    // DEBUG 2: Parse apenas (comente saveSignal para isolar erro)
    const sig = parseSignal(req.body);
    logger.info('[webhook/signal] Sinal parseado:', sig);

    // DEBUG 3: Salva no banco
    await saveSignal(sig);

    res.status(200).json({ status: 'ok', message: 'Signal salvo com sucesso!' });
  } catch (err) {
    logger.error('[webhook/signal] ERRO:', err.stack || err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ========== DOMINANCE ==========
router.post('/dominance', async (req, res) => {
  try {
    logger.info('[webhook/dominance] Payload recebido:', req.body);

    const dom = parseDominance(req.body);
    logger.info('[webhook/dominance] Dominance parseado:', dom);

    await saveDominance(dom);

    res.status(200).json({ status: 'ok', message: 'Dominance salvo com sucesso!' });
  } catch (err) {
    logger.error('[webhook/dominance] ERRO:', err.stack || err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
