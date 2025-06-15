// src/utils/scheduler.js
import cron from 'node-cron';
import {
  fetchMetrics,
  saveMarketMetrics,
  fetchFearGreed,
  saveFearGreed,
  fetchDominance,      // <-- nova função
  saveDominance        // <-- nova função
} from '../services/coinstatsService.js';
import { query } from '../services/databaseService.js';

export function setupScheduler() {
  // Coleta de métricas de mercado (markets) a cada 2h
  cron.schedule('0 */2 * * *', async () => {
    try {
      const apiKey = process.env.COINSTATS_API_KEY;

      // 1) Markets
      const metrics = await fetchMetrics(apiKey);
      await saveMarketMetrics(metrics);

      // 2) Fear & Greed
      const fg = await fetchFearGreed(apiKey);
      await saveFearGreed(fg);

      // 3) BTC Dominance
      const dom = await fetchDominance(apiKey);
      await saveDominance(dom);

      console.log('✅ CoinStats: markets, fear-greed e dominance salvos');
    } catch (err) {
      console.error('🚨 Erro no scheduler CoinStats:', err);
    }
  });

  // Limpeza diária de signals antigos (>72h)
  cron.schedule('0 1 * * *', async () => {
    try {
      await query(`DELETE FROM signals WHERE captured_at < NOW() - INTERVAL '72 hours'`);
      console.log('🗑️ Signals antigas limpas');
    } catch (err) {
      console.error('🚨 Erro ao limpar sinais antigos:', err);
    }
  });
}
