import express from 'express';
import axios from 'axios';

const router = express.Router();

// Webhook moedas
router.post('/signal', (req, res) => {
  console.log('WEBHOOK MOEDAS:', req.body);
  res.status(200).json({ ok: true, recebido: req.body });
});

// Webhook sinal BTC
router.post('/dominance', (req, res) => {
  console.log('WEBHOOK SINAL BTC:', req.body);
  res.status(200).json({ ok: true, recebido: req.body });
});

// GET /webhook/market - exemplo de consulta externa
router.get('/market', async (_req, res) => {
  try {
    // Substitua pela URL real que deseja consultar (Coinstars ou outro)
    const url = 'https://api.coinstars.com/market'; // AJUSTE conforme a documentação!
    const response = await axios.get(url);
    res.json({ status: 'ok', data: response.data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
