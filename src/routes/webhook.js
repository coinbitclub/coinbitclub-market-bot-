import express from 'express';
import { saveSignal } from '../services/signalsService.js';
import { saveDominance } from '../services/dominanceService.js';
import { saveFearGreed } from '../services/fearGreedService.js';

const router = express.Router();

// POST SIGNAL
router.post('/signal', async (req, res) => {
  try {
    const data = req.body;
    if (!data.ticker || !data.time) {
      return res.status(400).json({ error: 'ticker and time are required' });
    }
    await saveSignal(data);
    res.json({ msg: 'POST /webhook/signal funcionando', body: data });
  } catch (err) {
    console.error('Erro ao salvar signal:', err);
    res.status(500).json({ error: 'Erro ao salvar signal' });
  }
});

// GET SIGNAL (últimas 72h)
router.get('/signal', async (req, res) => {
  try {
    // busca os sinais das últimas 72 horas (ajuste conforme o seu serviço)
    // Exemplo:
    // const signals = await getSignalsLast72h();
    res.json({ msg: "GET /webhook/signal funcionando", /*signals*/ });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar sinais' });
  }
});

// POST DOMINANCE
router.post('/dominance', async (req, res) => {
  try {
    await saveDominance(req.body);
    res.json({ msg: 'Dominance recebido', body: req.body });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar dominance' });
  }
});

// GET DOMINANCE (últimas 72h)
router.get('/dominance', async (req, res) => {
  try {
    // const dominance = await getDominanceLast72h();
    res.json({ msg: "GET /webhook/dominance funcionando", /*dominance*/ });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dominance' });
  }
});

// Idem para fear_greed...

export default router;
