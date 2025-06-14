// src/services/signalsService.js
import { executeQuery } from './databaseService.js';

export async function saveSignal(payload) {
  const query = `
    INSERT INTO signals (payload, data_hora)
    VALUES ($1, NOW())
    RETURNING id;
  `;
  const params = [payload];
  return await executeQuery(query, params);
}

export async function getSignalsByUser(user_id) {
  const query = `
    SELECT * FROM signals WHERE user_id = $1 ORDER BY data_hora DESC;
  `;
  return await executeQuery(query, [user_id]);
}
