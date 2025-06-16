import cron from 'node-cron';
import { cleanupOldRecords, consolidateDailyData } from './services/cleanupService.js';

cron.schedule('0 0 * * *', async () => {
  await consolidateDailyData();
});
cron.schedule('0 * * * *', async () => {
  await cleanupOldRecords();
});
