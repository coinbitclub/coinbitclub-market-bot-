import axios from 'axios';
import { query } from '../databaseService.js';

// Dominance Webhook (TradingView)
export function parseDominance(payload) {
  let captured_at = new Date();
  if (payload.time) {
    const ms = String(payload.time).match(/\d{13}/);
    captured_at = ms ? new Date(Number(ms[0])) : new Date(payload.time);
  }

  return {
    ticker: payload.ticker,
    captured_at,
    dominance_pct: parseFloat(payload.btc_dominance || payload.dominance),
    ema7: parseFloat(payload.ema_7 || payload.ema7),
    diff_pct: parseFloat(payload.diff_pct),
    signal: payload.sinal || payload.signal
  };
}

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

// Consulta CoinStats /markets
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
export async function saveMarketMetrics(metrics) {
  const sql = `
    INSERT INTO market_metrics
      (captured_at, volume_24h, market_cap, dominance, altcoin_season, rsi_market)
    VALUES ($1,$2,$3,$4,$5,$6)
  `;
  await query(sql, [
    metrics.captured_at,
    metrics.volume_24h,
    metrics.market_cap,
    metrics.dominance,
    metrics.altcoin_season,
    metrics.rsi_market
  ]);
}

// Consulta CoinStats /insights/fear-and-greed
export async function fetchFearGreed(apiKey) {
  const res = await axios.get('https://openapiv1.coinstats.app/insights/fear-and-greed', { params: { key: apiKey } });
  const d = res.data.now;
  return {
    captured_at: new Date(d.update_time || Date.now()),
    value: d.value,
    classification: d.value_classification,
    source: 'coinstats'
  };
}
export async function saveFearGreed(fearGreed) {
  const sql = `
    INSERT INTO fear_greed
      (captured_at, value, classification, source)
    VALUES ($1,$2,$3,$4)
  `;
  await query(sql, [
    fearGreed.captured_at,
    fearGreed.value,
    fearGreed.classification,
    fearGreed.source
  ]);
}
