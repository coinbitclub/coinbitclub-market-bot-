import express from 'express';
const router = express.Router();

router.post('/signal', (req, res) => {
  console.log('BODY:', req.body);
  res.status(200).json({ ok: true });
});

export default router;

