import cron from 'node-cron';
import { fetchAndSaveMetrics } from '../src/coinstatsService.js';
import { query } from '../src/databaseService.js';
import { logger } from '../src/logger.js';

export function setupScheduler() {
cron.schedule('0 8,12,16 * * *', async () => { await fetchAndSaveMetrics(); });
cron.schedule('0 * * * *', async () => { await query(DELETE FROM signals WHERE created_at < NOW() - INTERVAL '72 hours'); });
}
