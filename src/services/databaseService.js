// src/services/databaseService.js
import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getBybitCredentials(userId) {
  const { rows } = await pool.query(
    `SELECT api_key, api_secret
     FROM user_exchanges
     WHERE user_id = $1 AND exchange_name = 'bybit'`,
    [userId]
  );
  if (!rows[0]) throw new Error('Credenciais Bybit não encontradas');
  return rows[0];
}

export async function query(text, params) {
  return pool.query(text, params);
}
