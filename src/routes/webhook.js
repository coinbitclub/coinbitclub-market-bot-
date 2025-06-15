import express from 'express';
import { executeQuery } from '../services/databaseService.js';
const router = express.Router();

router.post('/signal', async (req, res) => {
  try {
    const s = req.body;
    await executeQuery(
      `INSERT INTO signals (ticker, time, close, ema9_30, rsi_4h, rsi_15, momentum_15,
                             atr_30, atr_pct_30, vol_30, vol_ma_30,
                             diff_btc_ema7, cruzou_acima_ema9, cruzou_abaixo_ema9)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [s.ticker, s.time, s.close,
       s.ema9_30, s.rsi_4h, s.rsi_15, s.momentum_15,
       s.atr_30, s.atr_pct_30, s.vol_30, s.vol_ma_30,
       s.diff_btc_ema7, s.cruzou_acima_ema9, s.cruzou_abaixo_ema9]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Webhook save error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
