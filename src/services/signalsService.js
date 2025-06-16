import pool from '../db.js';

export async function saveSignal(data) {
  // Adapte os campos conforme sua tabela signals
  const {
    ticker, time, close, ema9_30, rsi_4h, rsi_15,
    momentum_15, atr_30, atr_pct_30, vol_30,
    vol_ma_30, diff_btc_ema7, cruzou_acima_ema9, cruzou_abaixo_ema9
  } = data;
  await pool.query(
    `INSERT INTO signals (
      ticker, time, close, ema9_30, rsi_4h, rsi_15, momentum_15, atr_30, atr_pct_30, vol_30, vol_ma_30, diff_btc_ema7, cruzou_acima_ema9, cruzou_abaixo_ema9
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [ticker, time, close, ema9_30, rsi_4h, rsi_15, momentum_15, atr_30, atr_pct_30, vol_30, vol_ma_30, diff_btc_ema7, cruzou_acima_ema9, cruzou_abaixo_ema9]
  );
}
