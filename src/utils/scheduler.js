import cron from 'node-cron';
import { query } from '../databaseService.js';

export function setupScheduler() {
  // todo dia à 00:00 limpa sinais com >72h
  cron.schedule('0 0 * * *', async () => {
    try {
      await query(
        "DELETE FROM signals WHERE created_at < NOW() - INTERVAL '72 hours'"
      );
      console.log('Old signals cleaned');
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  });
}
