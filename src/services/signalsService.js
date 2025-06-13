// src/services/signalsService.js
import { query } from '../databaseService.js';

export async function saveSignal(signal) {
  const sql = `
    INSERT INTO signals (
      ticker,
      captured_at,
      close,
      ema9_30,
      rsi_4h,
      rsi_15,
      momentum_15,
      atr_30,
      atr_pct_30,
      vol_30,
      vol_ma_30,
      diff_btc_ema7,
      cruzou_acima_ema9,
      cruzou_abaixo_ema9,
      leverage
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
    )
  `;
  await query(sql, [
    signal.ticker,            // $1
    signal.time,              // $2 → será armazenado em captured_at
    signal.close,             // $3
    signal.ema9_30,           // $4
    signal.rsi_4h,            // $5
    signal.rsi_15,            // $6
    signal.momentum_15,       // $7
    signal.atr_30,            // $8
    signal.atr_pct_30,        // $9
    signal.vol_30,            // $10
    signal.vol_ma_30,         // $11
    signal.diff_btc_ema7,     // $12
    signal.cruzou_acima_ema9, // $13
    signal.cruzou_abaixo_ema9,// $14
    signal.leverage           // $15
  ]);
}
