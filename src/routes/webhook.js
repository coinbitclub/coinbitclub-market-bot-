import express from 'express';
import { saveSignal } from '../services/signalsService.js';
// Adicione outros imports se necessário

const router = express.Router();

// Exemplo de rota GET (apague ou ajuste se já existe!)
router.get('/signal', (req, res) => {
  res.json({ msg: 'GET /webhook/signal funcionando' });
});

// Exemplo de rota POST (ajuste conforme sua lógica)
router.post('/signal', async (req, res) => {
  try {
    const result = await saveSignal(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar signal' });
  }
});

export default router;
