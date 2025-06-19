// src/services/dominanceService.js
import logger from '../utils/logger.js';
import { query } from './databaseService.js';

/**
 * Salva um registro de dominância recebido via webhook.
 * @param {number|null} userId — nunca usado, mas vem do router
 * @param {{ dominance: number, time: Date }} data
 */
export async function saveDominance(userId, data) {
  logger.info('Saving dominance', { userId, ...data });
  const sql = `
    INSERT INTO dominance_daily(time, dominance)
    VALUES ($1, $2)
  `;
  await query(sql, [data.time, data.dominance]);
}
