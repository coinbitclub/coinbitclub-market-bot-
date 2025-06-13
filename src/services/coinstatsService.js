// src/services/coinstatsService.js
import { query } from '../databaseService.js';

export function parseDominance(payload) {
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
    dominance_pct: parseFloat(payload.btc_dominance ?? payload.dominance),
    ema7: parseFloat(payload.ema_7 ?? payload.ema7),
    diff_pct: parseFloat(payload.diff_pct),
    signal: payload.sinal ?? payload.signal ?? null
  };
}

export async function saveDominance(dom) {
  const sql = `
    INSERT INTO btc_dominance_signals
      (ticker, captured_at, dominance_pct, ema7, diff_pct, signal)
    VALUES($1,$2,$3,$4,$5,$6)
  `;
  await query(sql, [
    dom.ticker,
    dom.captured_at,
    dom.dominance_pct,
    dom.ema7,
    dom.diff_pct,
    dom.signal
  ]);
}
