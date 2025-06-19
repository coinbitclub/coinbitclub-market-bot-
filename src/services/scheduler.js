// src/services/scheduler.js
import cron from 'node-cron';
import logger from '../utils/logger.js';
import {
  fetchAndSaveDominance,
  fetchAndSaveFearGreed,
  fetchAndSaveMarkets
} from './coinstatsService.js';

export function setupScheduler() {
  cron.schedule('0 * * * *', async () => {
    try {
      await fetchAndSaveDominance();
    } catch (err) {
      logger.error('Dominance job error, but moving on', err);
    }
    try {
      await fetchAndSaveFearGreed();
    } catch (err) {
      logger.error('Fear & Greed job error, but moving on', err);
    }
    try {
      await fetchAndSaveMarkets();
    } catch (err) {
      logger.error('Markets job error, but moving on', err);
    }
  });
}
