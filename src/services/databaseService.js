/* ===========================================
   src/databaseService.js
   =========================================== */
import pkg from 'pg';
const { Pool } = pkg;

// Ajuste sua connectionString aqui (já vem do Railway/SOFTR/SOA/etc)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
});

export async function query(text, params) {
  return pool.query(text, params);
}
