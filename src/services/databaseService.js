// services/databaseService.js
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

// Em produção no Railway/Postgres precisamos de ssl:{rejectUnauthorized:false}
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
})

/**
 * Executa um SQL parametrizado e devolve o resultado.
 * @param {string} text – query SQL com placeholders $1, $2…
 * @param {any[]} params – valores para os placeholders
 * @returns {Promise<import('pg').QueryResult>}
 */
export async function query(text, params) {
  const client = await pool.connect()
  try {
    const res = await client.query(text, params)
    return res
  } finally {
    client.release()
  }
}
