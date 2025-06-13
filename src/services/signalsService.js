// src/services/signalsService.js
import { query } from '../databaseService.js';

// Função para normalizar e preparar o payload recebido do Pine
export function parseSignal(payload) {
  let captured_at = new Date();
  if (payload.time) {
    if (typeof payload.time === 'number' || /^\d+$/.test(payload.time)) {
      captured_at = new Date(Number(payload.time));
    } else {
      captured_at = new Date(payload.time);
    }
  }
  return {
    ticker: payload.ticker,
    captured_at,
    close: parseFloat(payload.close),
    ema9_30: parseFloat(payload.ema9_30),
    rsi_4h: parseFloat(payload.rsi_4h),
    rsi_15: parseFloat(payload.rsi_15),
    momentum_15: parseFloat(payload.momentum_15),
    atr_30: parseFloat(payload.atr_30),
    atr_pct_30: parseFloat(payload.atr_pct_30),
    vol_30: parseFloat(payload.vol_30),
    vol_ma_30: parseFloat(payload.vol_ma_30),
    diff_btc_ema7: parseFloat(payload.diff_btc_ema7),
    cruzou_acima_ema9: !!parseInt(payload.cruzou_acima_ema9),
    cruzou_abaixo_ema9: !!parseInt(payload.cruzou_abaixo_ema9),
    leverage: payload.leverage ? parseInt(payload.leverage) : 6
  };
}

export async function saveSignal(signal) {
  const sql = `
    INSERT INTO signals
      (ticker, captured_at, close, ema9_30, rsi_4h, rsi_15, momentum_15, atr_30, atr_pct_30, vol_30, vol_ma_30, diff_btc_ema7, cruzou_acima_ema9, cruzou_abaixo_ema9, leverage)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
  `;
  await query(sql, [
    signal.ticker,
    signal.captured_at,
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
    signal.cruzou_abaixo_ema9,
    signal.leverage
  ]);
}
