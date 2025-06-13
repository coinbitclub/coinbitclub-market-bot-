import cron from 'node-cron';
import { fetchAndSaveMetrics } from '../services/coinstatsService.js';
import { query } from '../services/databaseService.js';
import { logger } from '../logger.js';

export function setupScheduler() {
  // A cada hora
  cron.schedule('0 * * * *', async () => {
    try {
      await fetchAndSaveMetrics();
      logger.info('📊 CoinStats metrics saved');
    } catch(e) {
      logger.error('Error fetching metrics', e);
    }
  });

  // Todo dia à meia-noite UTC: placeholder de retraining
  cron.schedule('0 0 * * *', async () => {
    logger.info('🔄 Daily retraining placeholder');
    // aqui você chama fine-tune ou lógica de ML
  });

  // Todo dia à meia-noite UTC: purga sinais >72h
  cron.schedule('0 0 * * *', async () => {
    try {
      await query(`DELETE FROM signals WHERE created_at < NOW() - INTERVAL '72 hours'`);
      logger.info('🧹 Old signals purged');
    } catch(e) {
      logger.error('Error purging signals', e);
    }
  });

  logger.info('⏰ Scheduler started');
}
