import express from 'express';
const router = express.Router();

router.post('/signal', (req, res) => {
  // Exemplo de log simples
  console.log('Sinal recebido:', req.body);
  res.status(200).json({ success: true });
});

export default router;
