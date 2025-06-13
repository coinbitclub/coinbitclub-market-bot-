import cron from 'node-cron';
import { query } from '../databaseService.js';
import { fetchAndSaveMetrics } from '../coinstatsService.js';
import { logger } from '../logger.js';

export function setupScheduler() {
  // Cron de métricas: 3× ao dia
  cron.schedule('0 8,12,16 * * *', async () => {
    try {
      await fetchAndSaveMetrics();
      logger.info('Metrics fetched');
    } catch (err) {
      logger.error(`Metrics error: ${err.message}`);
    }
  });

  // Purge de sinais (>72h)
  cron.schedule('0 * * * *', async () => {
    try {
      await query(`DELETE FROM signals WHERE created_at < NOW() - INTERVAL '72 hours'`);
      logger.info('Old signals removed');
    } catch (err) {
      logger.error(`Purge error: ${err.message}`);
    }
  });
  cron.schedule('0 8,12,16 * * *', async () => {
  try {
    await fetchAndSaveMetrics();
  } catch (err) {
    logger.error(`Metrics cron error: ${err.message}`);
  }
});
}
