/* ========== src/utils/scheduler.js ========== */
import cron from 'node-cron';
import { dailyRetraining, monitorOpenPositions } from '../tradingBot.js';

export function setupScheduler() {
  // Treinamento diário às 00:05
  cron.schedule('5 0 * * *', dailyRetraining);
  // Monitoramento de posições abertas a cada minuto
  cron.schedule('* * * * *', monitorOpenPositions);
}
