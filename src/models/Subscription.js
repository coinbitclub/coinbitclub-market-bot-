// models/Subscription.js
import { query } from '../services/databaseService.js'

/** Cria ou atualiza assinatura */
export async function upsertSubscription({ userId, plan, expiresAt }) {
  const sql = `
    INSERT INTO subscriptions (user_id, plan, expires_at)
    VALUES ($1,$2,$3)
    ON CONFLICT (user_id) DO UPDATE
      SET plan = EXCLUDED.plan,
          expires_at = EXCLUDED.expires_at
    RETURNING *
  `
  const res = await query(sql, [userId, plan, expiresAt])
  return res.rows[0]
}

/** Verifica se está ativa no momento */
export async function isSubscriptionActive(userId) {
  const sql = `
    SELECT 1 FROM subscriptions
    WHERE user_id = $1 AND expires_at > NOW()
  `
  const res = await query(sql, [userId])
  return res.rowCount > 0
}
