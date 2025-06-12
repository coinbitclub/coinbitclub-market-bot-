import cron from 'node-cron';
import { fetchAndStoreFearGreed, fetchAndStoreDominance } from './services/coinstatsService.js';

export function startAll() {
  // A cada 30m
  cron.schedule('*/30 * * * *', async () => {
    try {
      await fetchAndStoreDominance();
      console.log('[CoinStats] Cron BTC Dominance: OK');
    } catch (err) {
      console.error('[CoinStats] Cron BTC Dominance:', err.message);
    }
  });
  cron.schedule('*/30 * * * *', async () => {
    try {
      await fetchAndStoreFearGreed();
      console.log('[CoinStats] Cron Fear & Greed: OK');
    } catch (err) {
      console.error('[CoinStats] Cron error (Fear & Greed):', err.message);
    }
  });
}
