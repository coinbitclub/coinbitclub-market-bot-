import { query } from '../databaseService.js';

// --------------- DOMINANCE ----------------
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

// --------------- FEAR & GREED --------------
export async function fetchFearGreed(apiKey) {
  const res = await fetch(`https://openapiv1.coinstats.app/insights/fear-and-greed?apikey=${apiKey}`);
  if (!res.ok) throw new Error('Erro ao buscar Fear & Greed');
  return await res.json();
}

export async function saveFearGreed(data) {
  // Supondo que sua tabela se chama fear_greed e tem os campos abaixo:
  const sql = `
    INSERT INTO fear_greed (captured_at, value, value_classification)
    VALUES($1, $2, $3)
  `;
  await query(sql, [
    new Date(data.now.timestamp * 1000),
    data.now.value,
    data.now.value_classification
  ]);
}

// --------------- MARKET METRICS ------------
export async function fetchMetrics(apiKey) {
  const res = await fetch(`https://openapiv1.coinstats.app/markets?apikey=${apiKey}`);
  if (!res.ok) throw new Error('Erro ao buscar métricas de mercado');
  return await res.json();
}

export async function saveMarketMetrics(metrics) {
  // Adapte para os campos reais da sua tabela
  const sql = `
    INSERT INTO market_metrics (captured_at, market_cap, volume, btc_dominance)
    VALUES($1, $2, $3, $4)
  `;
  await query(sql, [
    new Date(),
    metrics.marketCap,
    metrics.volume,
    metrics.btcDominance
  ]);
}
