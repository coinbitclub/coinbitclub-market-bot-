import axios from 'axios';
import { query } from '../databaseService.js';

// 1) Consulta API (metrics)
export async function fetchMetrics(apiKey) {
  const res = await axios.get('https://openapiv1.coinstats.app/markets', { params: { key: apiKey } });
  const d = res.data;
  return {
    captured_at:   new Date(),
    volume_24h:    Number(d.volume_24h),
    market_cap:    Number(d.market_cap),
    dominance:     Number(d.dominance),
    altcoin_season:d.altcoin_season,
    rsi_market:    Number(d.rsi_market)
  };
}

// 2) Consulta API (fear/greed)
export async function getFearGreedAndDominance(apiKey) {
  const res = await axios.get('https://openapiv1.coinstats.app/insights', { params: { key: apiKey } });
  return {
    fearGreed: res.data.fearGreed,
    dominance: res.data.dominance
  };
}

// 3) Parser para dominance (webhook)
export function parseDominance(payload) {
  return {
    ticker:         payload.ticker,
    captured_at:    new Date(Number(payload.time.toString().replace(/.*(\d{13})/, "$1"))),
    dominance_pct:  parseFloat(payload.btc_dominance || payload.dominance),
    ema7:           parseFloat(payload.ema_7 || payload.ema7),
    diff_pct:       parseFloat(payload.diff_pct),
    signal:         payload.sinal || payload.signal
  };
}

// 4) Salvar dominance no banco
export async function saveDominance(dominance) {
  const sql = `
    INSERT INTO btc_dominance_signals
      (ticker, captured_at, dominance_pct, ema7, diff_pct, signal)
    VALUES($1,$2,$3,$4,$5,$6)
  `;
  await query(sql, [
    dominance.ticker,
    dominance.captured_at,
    dominance.dominance_pct,
    dominance.ema7,
    dominance.diff_pct,
    dominance.signal
  ]);
}
