import cron from 'node-cron';
import {
  fetchAndSaveFearGreed,
  fetchAndSaveBTCDominance
} from './coinstatsService.js';

export function startCoinstatsCron() {
  // a cada 30 minutos
  cron.schedule('0,30 * * * *', async () => {
    try {
      await fetchAndSaveBTCDominance();
      console.log('[Cron] BTC Dominance salvo');
    } catch (err) {
      console.error('[Cron BTC] erro:', err.message);
    }

    try {
      await fetchAndSaveFearGreed();
      console.log('[Cron] Fear & Greed salvo');
    } catch (err) {
      console.error('[Cron FG] erro:', err.message);
    }
  }, { timezone: 'UTC' });
}
