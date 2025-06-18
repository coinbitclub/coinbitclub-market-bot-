import cron from 'node-cron';
import {
  fetchAndSaveDominance,
  fetchAndSaveFearGreed,
  fetchAndSaveMarkets
} from './services/coinstatsService.js';

// dispara as jobs de coleta dos dados da CoinStats
export function setupScheduler() {
  // a cada minuto, coleta BTC Dominance
  cron.schedule('* * * * *', () => {
    console.log('[CRON] fetchAndSaveDominance');
    fetchAndSaveDominance();
  });

  // a cada 5 minutos, coleta mercados
  cron.schedule('*/5 * * * *', () => {
    console.log('[CRON] fetchAndSaveMarkets');
    fetchAndSaveMarkets();
  });

  // todo início de hora, coleta Fear & Greed
  cron.schedule('0 * * * *', () => {
    console.log('[CRON] fetchAndSaveFearGreed');
    fetchAndSaveFearGreed();
  });
}
