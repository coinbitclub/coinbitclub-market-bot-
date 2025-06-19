// src/services/dominanceService.js
import { query } from './databaseService.js';

export async function saveDominance(userId, dom) {
  const sql = `
    INSERT INTO dominance(
      user_id, dominance, ema7, timestamp
    ) VALUES ($1, $2, $3, $4)
  `;
  await query(sql, [
    userId,
    dom.dominance,
    dom.ema7,
    dom.timestamp
  ]);
}
