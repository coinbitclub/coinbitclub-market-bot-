import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

export async function getClientBySoftrId(softrClientId) {
  const res = await pool.query(
    'SELECT * FROM clients WHERE softr_client_id = $1 AND subscription_end > now()',
    [softrClientId]
  );
  return res.rows[0];
}

export async function saveOperation(op) {
  const { client_id, symbol, side, qty, price, resultado, bybit_response, reference_code } = op;
  await pool.query(
    `INSERT INTO operations
      (client_id, symbol, side, qty, price, resultado, bybit_response, reference_code)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [client_id, symbol, side, qty, price, resultado, bybit_response, reference_code]
  );
}

export async function getLatestMarketMode() {
  const res = await pool.query(
    'SELECT mode FROM market_mode ORDER BY updated_at DESC LIMIT 1'
  );
  return res.rows[0]?.mode;
}

export async function setMarketMode(mode) {
  await pool.query(
    'INSERT INTO market_mode (mode) VALUES ($1)',
    [mode]
  );
}

export default pool;
