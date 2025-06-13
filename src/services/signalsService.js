import { query } from '../databaseService.js';

export async function saveSignal(signal) {
  const sql = `
    INSERT INTO signals
      (ticker, captured_at, close, ema9_30, rsi_4h, rsi_15, momentum_15,
       atr_30, atr_pct_30, vol_30, vol_ma_30, diff_btc_ema7,
       cruzou_acima_ema9, cruzou_abaixo_ema9, leverage)
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

// Para parsear o payload do Pine/TradingView
export function parseSignal(payload) {
  // timestamp: pode vir em diferentes formatos, trate conforme necessário
  let captured_at = new Date();
  if (payload.time) {
    if (String(payload.time).length > 10) {
      // Caso venha em formato tipo yyyy-MM-dd HH:mm:ssNNNNNNNNNNNNN
      const ms = String(payload.time).match(/\d{13}/);
      captured_at = ms ? new Date(Number(ms[0])) : new Date(payload.time);
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
    cruzou_acima_ema9: Boolean(Number(payload.cruzou_acima_ema9)),
    cruzou_abaixo_ema9: Boolean(Number(payload.cruzou_abaixo_ema9)),
    leverage: payload.leverage ? parseInt(payload.leverage) : 6
  };
}
