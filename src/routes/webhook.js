import express from 'express';
const router = express.Router();

// Healthcheck GET
router.get('/signal', (req, res) => {
  res.json({ status: 'ok', message: 'GET /webhook/signal está ativo' });
});

// POST robusto (apenas loga e responde)
router.post('/signal', (req, res) => {
  console.log("DEBUG POST /webhook/signal:", req.body);

  // Responde imediatamente sem mexer no banco
  return res.status(200).json({
    status: 'ok',
    received: req.body
  });
});

export default router;
