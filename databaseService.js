import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function saveFearGreed(payload) {
  await pool.query(
    `INSERT INTO coinstats_fear_greed(raw_payload) VALUES($1)`,
    [payload]
  );
}

export async function saveBTCDominance(payload) {
  await pool.query(
    `INSERT INTO coinstats_btc_dominance(raw_payload) VALUES($1)`,
    [payload]
  );
}

export async function getLatestFearGreed() {
  const { rows } = await pool.query(
    `SELECT raw_payload FROM coinstats_fear_greed ORDER BY received_at DESC LIMIT 1`
  );
  return rows[0]?.raw_payload ?? null;
}

export async function getLatestBTCDominance() {
  const { rows } = await pool.query(
    `SELECT raw_payload FROM coinstats_btc_dominance ORDER BY received_at DESC LIMIT 1`
  );
  return rows[0]?.raw_payload ?? null;
}
