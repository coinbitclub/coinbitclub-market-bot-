// models/User.js
import { query } from '../services/databaseService.js'

/**
 * Insere (ou atualiza) um usuário com suas credenciais Bybit criptografadas.
 */
export async function upsertUser({ userId, nickname, apiKeyEnc, apiSecretEnc }) {
  const sql = `
    INSERT INTO users (id, nickname, bybit_api_key, bybit_api_secret)
    VALUES ($1,$2,$3,$4)
    ON CONFLICT (id) DO UPDATE
      SET nickname = EXCLUDED.nickname,
          bybit_api_key = EXCLUDED.bybit_api_key,
          bybit_api_secret = EXCLUDED.bybit_api_secret
    RETURNING *
  `
  const values = [userId, nickname, apiKeyEnc, apiSecretEnc]
  const res = await query(sql, values)
  return res.rows[0]
}

/** Busca usuário pelo ID */
export async function getUserById(userId) {
  const res = await query(`SELECT * FROM users WHERE id = $1`, [userId])
  return res.rows[0] || null
}
