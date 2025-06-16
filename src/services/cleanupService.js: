// src/services/cleanupService.js

import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Limpeza dos registros antigos (mais de 72h)
export async function cleanupOldRecords() {
  // Exemplo para tabela signals
  await pool.query(`DELETE FROM signals WHERE created_at < NOW() - INTERVAL '72 hours'`);
  await pool.query(`DELETE FROM dominance WHERE created_at < NOW() - INTERVAL '72 hours'`);
  await pool.query(`DELETE FROM fear_greed WHERE created_at < NOW() - INTERVAL '72 hours'`);
}

// Consolida o fechamento diário
export async function consolidateDailyData() {
  // Adapte a lógica para signals, dominance, fear_greed etc.
  // Exemplo para signals:
  await pool.query(`
    INSERT INTO signals_daily (ticker, date, avg_close, max_close, min_close)
    SELECT
      ticker,
      CURRENT_DATE,
      AVG(close),
      MAX(close),
      MIN(close)
    FROM signals
    WHERE created_at::date = CURRENT_DATE - INTERVAL '1 day'
    GROUP BY ticker
    ON CONFLICT (ticker, date) DO NOTHING
  `);

  // Exemplo para dominance:
  await pool.query(`
    INSERT INTO dominance_daily (date, avg_btc_dominance, max_btc_dominance, min_btc_dominance)
    SELECT
      CURRENT_DATE,
      AVG(btc_dominance),
      MAX(btc_dominance),
      MIN(btc_dominance)
    FROM dominance
    WHERE created_at::date = CURRENT_DATE - INTERVAL '1 day'
    ON CONFLICT (date) DO NOTHING
  `);

  // Exemplo para fear_greed:
  await pool.query(`
    INSERT INTO fear_greed_daily (date, avg_value, max_value, min_value)
    SELECT
      CURRENT_DATE,
      AVG(value),
      MAX(value),
      MIN(value)
    FROM fear_greed
    WHERE created_at::date = CURRENT_DATE - INTERVAL '1 day'
    ON CONFLICT (date) DO NOTHING
  `);
}
