// models/Signal.js
import { query } from '../services/databaseService.js'

/** Registra um sinal de setup vindo do TradingView */
export async function createSignal({ userId, rawPayload }) {
  const sql = `
    INSERT INTO signals (user_id, raw_payload)
    VALUES ($1, $2)
    RETURNING *
  `
  const res = await query(sql, [userId, rawPayload])
  return res.rows[0]
}

/** Lista últimos N sinais */
export async function listRecentSignals(limit = 50) {
  const res = await query(
    `SELECT * FROM signals ORDER BY received_at DESC LIMIT $1`,
    [limit]
  )
  return res.rows
}
