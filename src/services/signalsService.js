import db from './databaseService.js';

// obter último registro para debug
export async function getLatestFearGreed() {
  const rows = await db.query(
    `SELECT raw_payload FROM coinstats_fear_greed ORDER BY received_at DESC LIMIT 1`,
    []
  );
  return rows[0]?.raw_payload || null;
}
export async function getLatestBTCDominance() {
  const rows = await db.query(
    `SELECT raw_payload FROM coinstats_btc_dominance ORDER BY received_at DESC LIMIT 1`,
    []
  );
  return rows[0]?.raw_payload || null;
}
