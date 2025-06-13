/* =============================================
   src/databaseService.js
   ============================================= */
import pkg from 'pg';
import { logger } from './logger.js';
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    logger.info(`DB QUERY ${text} [${Date.now()-start}ms]`);
    return res;
  } catch (err) {
    logger.error(`DB ERROR ${err.message}`);
    throw err;
  }
}
