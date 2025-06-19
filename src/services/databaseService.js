import pkg from 'pg';
const { Pool } = pkg;

// Usa DATABASE_URL do .env ou variável de ambiente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function query(text, params) {
  return pool.query(text, params);
}

export default pool;
