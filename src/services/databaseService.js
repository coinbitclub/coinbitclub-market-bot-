// src/services/databaseService.js
import logger from '../utils/logger.js';

/**
 * Stub de query — mais tarde substitua pelo client real do pg.
 * @param {string} sql 
 * @param {any[]} params 
 */
export async function query(sql, params) {
  logger.info('DB QUERY', { sql: sql.trim(), params });
  // ex.: return await client.query(sql, params);
}
