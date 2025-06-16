import express from 'express';

const router = express.Router();

// Handler para GET /webhook/signal
router.get('/signal', (req, res) => {
  res.status(200).json({ status: "ok", msg: "GET recebido com sucesso!" });
});

// Handler para POST /webhook/signal
router.post('/signal', (req, res) => {
  console.log('POST recebido:', req.body);
  res.status(200).json({ status: "ok", msg: "POST recebido com sucesso!", data: req.body });
});

export default router;
