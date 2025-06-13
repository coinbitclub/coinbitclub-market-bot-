import cron from 'node-cron';
import { query } from '../databaseService.js';
import { dailyRetraining } from '../tradingBot.js';

export function setupScheduler() {
  // 1) Deleta sinais com mais de 72h, a cada hora no minuto zero:
  cron.schedule('0 * * * *', async () => {
    await query(
      "DELETE FROM signals WHERE created_at < NOW() - INTERVAL '72 hours'"
    );
  });

  // 2) Re-treina a IA todo dia à meia-noite UTC:
  cron.schedule('0 0 * * *', async () => {
    await dailyRetraining();
  });
}
