import pkg from 'pg';
const { Pool } = pkg;

// Adicione SSL para Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Função genérica de query
export async function query(sql, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(sql, params);
    return res.rows;
  } finally {
    client.release();
  }
}

// --- MÉTODOS ESPECÍFICOS DO SEU BOT ---

// Busca o valor Fear & Greed mais recente
export async function fetchFearGreed() {
  const sql = `SELECT * FROM fear_greed ORDER BY captured_at DESC LIMIT 1;`;
  const result = await query(sql, []);
  return result[0] || null;
}

// Salva um novo registro de Fear & Greed
export async function saveFearGreed(data) {
  const sql = `
    INSERT INTO fear_greed (value, captured_at)
    VALUES ($1, $2)
  `;
  await query(sql, [data.value, data.captured_at]);
}

// Busca métricas de mercado mais recentes
export async function fetchMetrics() {
  const sql = `SELECT * FROM market_metrics ORDER BY captured_at DESC LIMIT 1;`;
  const result = await query(sql, []);
  return result[0] || null;
}

// Salva um novo registro de métricas de mercado
export async function saveMarketMetrics(metrics) {
  const sql = `
    INSERT INTO market_metrics (name, value, captured_at)
    VALUES ($1, $2, $3)
  `;
  await query(sql, [metrics.name, metrics.value, metrics.captured_at]);
}
