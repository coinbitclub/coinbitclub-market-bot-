import cron from 'node-cron';
import { fetchMetrics, saveMarketMetrics, fetchFearGreed, saveFearGreed } from './services/coinstatsService.js;
import { query } from './services/databaseService.js'; // Corrigido: import correto!

export function setupScheduler() {
  // Coleta de métricas a cada 2h
  cron.schedule('0 */2 * * *', async () => {
    try {
      const apiKey = process.env.COINSTATS_API_KEY;
      const metrics = await fetchMetrics(apiKey);
      await saveMarketMetrics(metrics);

      const fg = await fetchFearGreed(apiKey);
      await saveFearGreed(fg);
      console.log('Dados do CoinStats registrados');
    } catch (err) {
      console.error('Erro no scheduler:', err);
    }
  });

  // Limpeza diária dos sinais antigos (>72h)
  cron.schedule('0 1 * * *', async () => {
    try {
      await query(`DELETE FROM signals WHERE captured_at < NOW() - INTERVAL '72 hours'`);
      console.log('Signals antigos limpos');
    } catch (err) {
      console.error('Erro ao limpar signals antigas:', err);
    }
  });
}
