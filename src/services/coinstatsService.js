import axios from 'axios';
import { query } from '../databaseService.js';

// 1. Buscar métricas de mercado global
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

// 2. Buscar Fear & Greed Index
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
  // src/services/coinstatsService.js

/**
 * Função para normalizar e preparar o payload de Dominância BTC recebido pelo webhook.
 * Aceita formatos variados vindos do TradingView.
 */
export function parseDominance(payload) {
  let captured_at = new Date();
  // Tenta normalizar a data/hora do sinal recebido
  if (payload.time) {
    // Caso venha em formato epoch milissegundos
    if (typeof payload.time === 'number' || /^\d+$/.test(payload.time)) {
      captured_at = new Date(Number(payload.time));
    } else {
      // Caso venha como string data/hora
      captured_at = new Date(payload.time);
    }
  }

  return {
    ticker:         payload.ticker ?? null,
    captured_at,
    dominance_pct:  parseFloat(payload.btc_dominance ?? payload.dominance ?? null),
    ema7:           parseFloat(payload.ema_7 ?? payload.ema7 ?? null),
    diff_pct:       parseFloat(payload.diff_pct ?? null),
    signal:         payload.sinal ?? payload.signal ?? null
  };
}

