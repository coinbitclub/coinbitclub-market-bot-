import express from 'express';
const router = express.Router();

// Healthcheck GET
router.get('/signal', (req, res) => {
  res.json({ msg: "GET /webhook/signal working" });
});

// Debug POST: só retorna o recebido
router.post('/signal', (req, res) => {
  console.log('POST recebido em /webhook/signal:', req.body);
  res.json({
    msg: "POST /webhook/signal funcionando",
    body: req.body
  });
});

export default router;
