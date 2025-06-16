import pool from '../db.js';

export async function saveSignal(signal) {
  try {
    const query = `
      INSERT INTO signals (
        ticker, time, close, ema9_30, rsi_4h, rsi_15,
        momentum_15, atr_30, atr_pct_30, vol_30, vol_ma_30,
        diff_btc_ema7, cruzou_acima_ema9, cruzou_abaixo_ema9
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )
      RETURNING *
    `;
    const values = [
      signal.ticker,
      signal.time,
      signal.close,
      signal.ema9_30,
      signal.rsi_4h,
      signal.rsi_15,
      signal.momentum_15,
      signal.atr_30,
      signal.atr_pct_30,
      signal.vol_30,
      signal.vol_ma_30,
      signal.diff_btc_ema7,
      signal.cruzou_acima_ema9,
      signal.cruzou_abaixo_ema9
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Erro ao salvar signal:', error);
    throw error;
  }
}
