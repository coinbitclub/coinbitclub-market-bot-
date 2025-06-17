import cron from 'node-cron';
import { fetchAndSaveDominance, fetchAndSaveMarkets, fetchAndSaveFearGreed } from './services/coinStatsService.js';

cron.schedule('*/30 * * * *', fetchAndSaveDominance); // Dominance cada 30min
cron.schedule('*/30 * * * *', fetchAndSaveMarkets);   // Markets cada 30min
cron.schedule('*/30 * * * *', fetchAndSaveFearGreed); // Fear & Greed cada 30min
