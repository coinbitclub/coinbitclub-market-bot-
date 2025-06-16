import express from 'express';
import { saveSignal } from '../services/signalsService.js';

const router = express.Router();

// Exemplo de rota, ajuste conforme sua lógica
router.get('/signal', (req, res) => {
  res.json({ msg: 'GET /webhook/signal funcionando' });
});

// Outras rotas aqui

export default router;
