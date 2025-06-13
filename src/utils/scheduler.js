import cron from 'node-cron';
import { query } from '../databaseService.js';
import { storeFearGreed, storeMarketMetrics } from '../coinstatsService.js';

export function setupScheduler() {
  // Purge signals older than 72h every hour
  cron.schedule('0 * * * *', async () => {
    await query(
      `DELETE FROM signals WHERE created_at < NOW() - INTERVAL '72 hours'`
    );
  });

  // Fetch Fear & Greed and BTC dominance every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    await storeFearGreed();
  });

  // Fetch market metrics every hour
  cron.schedule('0 * * * *', async () => {
    await storeMarketMetrics();
  });

  // ...add any additional cron jobs here...
}
