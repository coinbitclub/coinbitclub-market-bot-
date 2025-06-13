import axios from 'axios';
import { query } from '../databaseService.js';

// Salvar Dominância (BTC.D) recebida por webhook
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

/**
 * Parse da mensagem de Dominância recebida do TradingView
 */
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
    ticker: payload.ticker ?? null,
    captured_at,
    dominance_pct: parseFloat(payload.btc_dominance ?? payload.dominance ?? null),
    ema7: parseFloat(payload.ema_7 ?? payload.ema7 ?? null),
    diff_pct: parseFloat(payload.diff_pct ?? null),
    signal: payload.sinal ?? payload.signal ?? null
  };
}

// Métricas de mercado - para uso no scheduler
export async function fetchMetrics(apiKey) {
  const res = await axios.get('https://openapiv1.coinstats.app/markets', {
    headers: { 'X-API-KEY': apiKey }
  });
  const d = res.data;
  return {
    captured_at: new Date(),
    volume_24h: Number(d.volume),
    market_cap: Number(d.marketCap),
    btc_dominance: Number(d.btcDominance),
    market_cap_change: Number(d.marketCapChange),
    volume_change: Number(d.volumeChange),
    btc_dominance_change: Number(d.btcDominanceChange)
  };
}

export async function saveMarketMetrics(metrics) {
  const sql = `
    INSERT INTO market_metrics
      (captured_at, volume_24h, market_cap, btc_dominance, market_cap_change, volume_change, btc_dominance_change)
    VALUES($1,$2,$3,$4,$5,$6,$7)
  `;
  await query(sql, [
    metrics.captured_at,
    metrics.volume_24h,
    metrics.market_cap,
    metrics.btc_dominance,
    metrics.market_cap_change,
    metrics.volume_change,
    metrics.btc_dominance_change
  ]);
}

// Fear & Greed
export async function fetchFearGreed(apiKey) {
  const res = await axios.get('https://openapiv1.coinstats.app/insights/fear-and-greed', {
    headers: { 'X-API-KEY': apiKey }
  });
  const now = res.data.now;
  return {
    captured_at: new Date(),
    value: now.value,
    value_classification: now.value_classification,
    timestamp: new Date(now.timestamp * 1000)
  };
}

export async function saveFearGreed(data) {
  const sql = `
    INSERT INTO fear_greed
      (captured_at, value, value_classification, timestamp)
    VALUES($1,$2,$3,$4)
  `;
  await query(sql, [
    data.captured_at,
    data.value,
    data.value_classification,
    data.timestamp
  ]);
}
