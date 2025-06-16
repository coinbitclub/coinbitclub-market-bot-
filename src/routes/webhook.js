import express from 'express';
const router = express.Router();

// Handler para GET /webhook/signal
router.get('/signal', (req, res) => {
  res.status(200).json({ status: "ok", msg: "GET recebido com sucesso!" });
});

// Handler para POST /webhook/signal
router.post('/signal', async (req, res) => {
  try {
    let { time, ...rest } = req.body;

    // Aceita timestamp em milissegundos, ISO string, ou formato "YYYY-MM-DD HH:mm:ss"
    if (!time) {
      return res.status(400).json({ error: "Campo 'time' é obrigatório" });
    }

    let parsedTime;
    if (typeof time === "number") {
      // Se vier timestamp em milissegundos
      parsedTime = new Date(time).toISOString();
    } else if (typeof t
