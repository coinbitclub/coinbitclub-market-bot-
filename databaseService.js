import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function getClientBySoftrId(softrClientId) {
  const res = await pool.query(
    'SELECT * FROM users WHERE user_id = $1 AND assinatura_data_fim > NOW()',
    [softrClientId]
  );
  return res.rows[0];
}

export default pool;
