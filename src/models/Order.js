// models/Order.js
import { query } from '../services/databaseService.js'

/** Registra ordem que abrimos na Bybit */
export async function createOrder({
  userId,
  symbol,
  direction,
  entryPrice,
  leverage,
  rawResponse
}) {
  const sql = `
    INSERT INTO orders
      (user_id, symbol, direction, entry_price, leverage, raw_payload)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
  `
  const res = await query(sql, [
    userId,
    symbol,
    direction,
    entryPrice,
    leverage,
    rawResponse
  ])
  return res.rows[0]
}

/** Atualiza ordem ao fechar (TP/SL ou cancelamento) */
export async function closeOrder({ orderId, exitPrice, rawResponse }) {
  const sql = `
    UPDATE orders
      SET exit_price = $2,
          raw_payload = raw_payload || $3::jsonb
    WHERE id = $1
    RETURNING *
  `
  const res = await query(sql, [orderId, exitPrice, rawResponse])
  return res.rows[0]
}
