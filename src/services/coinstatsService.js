// src/services/coinstatsService.js
import axios from 'axios';
import { query } from '../databaseService.js';

/**
 * 1) Busca métricas de mercado global (CoinStats /markets)
 */
export async function fetchMetrics(apiKey) {
  const res = await axios.get('https://openapiv1.coinstats.app/markets', {
    params: { key: apiKey }
  });
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

/**
 * 2) Fear & Greed + Dominância BTC (CoinStats /insights)
 */
export async function getFearGreedAndDominance(apiKey) {
  const res = await axios.get('https://openapiv1.coinstats.app/insights', {
    params: { key: apiKey }
  });
  return {
    fearGreed: res.data.fearGreed,
    dominance: res.data.dominance
  };
}

/**
 * 3) Persiste webhook de dominância (BTC.D)
 */
export async function saveDominance(payload) {
  const sql = `
    INSERT INTO btc_dominance_signals
      (ticker, captured_at, dominance_pct, ema7, diff_pct, signal)
    VALUES($1,$2,$3,$4,$5,$6)
  `;
  await query(sql, [
    payload.ticker,
    new Date(payload.time),
    parseFloat(payload.btc_dominance  ?? payload.dominance),
    parseFloat(payload.ema_7          ?? payload.ema7),
    parseFloat(payload.diff_pct),
    payload.sinal   ?? payload.signal
  ]);
}
