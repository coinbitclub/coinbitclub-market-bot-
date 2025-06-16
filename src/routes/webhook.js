import express from 'express';
const router = express.Router();

router.post('/signal', (req, res) => {
  console.log('Sinal recebido:', req.body);
  res.json({ success: true });
});

export default router;
