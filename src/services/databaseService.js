import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function save(table, rawPayload) {
  const text = `INSERT INTO ${table} (raw_payload) VALUES ($1)`;
  await pool.query(text, [rawPayload]);
}
