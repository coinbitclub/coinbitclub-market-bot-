// src/coinstatsCron.js
import cron from 'node-cron';
import {
  getBTCDominanceAndSave,
  getFearAndGreedAndSave
} from './services/coinstatsService.js';

cron.schedule('0,30 * * * *', () => {
  getBTCDominanceAndSave().catch(e => console.error('[CoinStats] Cron BTC Dominance:', e));
  getFearAndGreedAndSave().catch(e => console.error('[CoinStats] Cron Fear & Greed:', e));
});

export default cron;
