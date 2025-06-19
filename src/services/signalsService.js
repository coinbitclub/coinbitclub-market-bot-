// src/services/signalsService.js
import { query } from './databaseService.js';

export async function saveSignal(userId, signal) {
  const sql = `
    INSERT INTO signals(
      user_id, ticker, time, close, ema9, rsi4h, rsi15, momentum15,
      atr30, atr_pct30, vol30, vol_ma30, diff_btc_ema7,
      cruzou_acima_ema9, cruzou_abaixo_ema9, leverage
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9, $10, $11, $12, $13,
      $14, $15, $16
    )
  `;
  await query(sql, [
    userId,
    signal.ticker,
    signal.time,
    signal.close,
    signal.ema9,
    signal.rsi4h,
    signal.rsi15,
    signal.momentum15,
    signal.atr30,
    signal.atrPct30,
    signal.vol30,
    signal.volMa30,
    signal.diffBtcEma7,
    signal.cruzouAcimaEma9,
    signal.cruzouAbaixoEma9,
    signal.leverage
  ]);
}
