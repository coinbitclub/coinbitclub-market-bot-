import express from 'express';
const router = express.Router();

// GET simples para teste
router.get('/signal', (req, res) => {
  res.json({ msg: 'GET /webhook/signal working' });
});

// POST simples para teste no Railway
router.post('/signal', (req, res) => {
  console.log('POST /webhook/signal', req.body);
  res.status(200).json({ msg: 'POST OK', received: req.body });
});

export default router;
