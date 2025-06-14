import express from 'express';
const router = express.Router();

router.post('/signal', async (req, res) => {
  console.log('[DEBUG] Chegou no /signal');
  console.log('[DEBUG] Body:', req.body);

  res.status(200).json({ status: 'ok', received: req.body });
});

export default router;
