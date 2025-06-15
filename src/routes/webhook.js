import express from 'express';

const router = express.Router();

// Sinal de moedas (TradingView)
router.post('/signal', (req, res) => {
  console.log('Sinal de moeda recebido:', req.body);
  res.status(200).json({ ok: true, recebido: req.body });
});

// Sinal BTC Dominance (TradingView)
router.post('/dominance', (req, res) => {
  console.log('Sinal de dominance recebido:', req.body);
  res.status(200).json({ ok: true, recebido: req.body });
});

// (Opcional) GET para debug
router.get('/market', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Webhook market ativo' });
});

export default router;
