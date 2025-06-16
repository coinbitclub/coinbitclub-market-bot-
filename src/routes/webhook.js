import express from 'express';
import { saveSignal } from '../services/signalsService.js';

const router = express.Router();

// Exemplo de rota GET
router.get('/signal', (req, res) => {
  res.json({ msg: 'GET /webhook/signal funcionando' });
});

// Exemplo de rota POST (ajuste conforme sua lógica)
router.post('/signal', async (req, res) => {
  try {
    await saveSignal(req.body);
    res.json({ msg: 'Sinal salvo com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar sinal' });
  }
});

export default router;
