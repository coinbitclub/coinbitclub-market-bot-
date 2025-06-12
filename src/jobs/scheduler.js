import cron from 'node-cron';
import { getLatestBTCDominance, getLatestFearGreed } from '../services/signalsService.js';
import db from '../services/databaseService.js';

export default function scheduler() {
  // rodada a cada 5 minutos
  cron.schedule('*/5 * * * *', async () => {
    try {
      const fg = await getLatestFearGreed();
      const dom = await getLatestBTCDominance();
      console.log('Scheduler executed:', { fg: fg?.now, dom });
      // aqui chamar funções de geração de sinais e ordens
    } catch (err) {
      console.error('Scheduler error', err);
    }
  });
}
