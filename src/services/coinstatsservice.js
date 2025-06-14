import { query } from '../databaseService.js';

// Busca o valor Fear & Greed mais recente do banco de dados
export async function fetchFearGreed() {
  const sql = `SELECT * FROM fear_greed ORDER BY captured_at DESC LIMIT 1;`;
  const result = await query(sql, []);
  return result[0] || null;
}

// Salva um novo registro de Fear & Greed no banco de dados
export async function saveFearGreed(data) {
  const sql = `
    INSERT INTO fear_greed (value, captured_at)
    VALUES ($1, $2)
  `;
  await query(sql, [data.value, data.captured_at]);
}

// Busca métricas de mercado mais recentes do banco de dados
export async function fetchMetrics() {
  const sql = `SELECT * FROM market_metrics ORDER BY captured_at DESC LIMIT 1;`;
  const result = await query(sql, []);
  return result[0] || null;
}

// Salva um novo registro de métricas de mercado no banco de dados
export async function saveMarketMetrics(metrics) {
  const sql = `
    INSERT INTO market_metrics (name, value, captured_at)
    VALUES ($1, $2, $3)
  `;
  await query(sql, [metrics.name, metrics.value, metrics.captured_at]);
}
