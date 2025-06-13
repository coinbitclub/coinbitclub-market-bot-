import cron from 'node-cron';
import { fetchMetrics, fetchFearGreed } from '../services/coinstatsService.js';
import { query } from '../databaseService.js';
import { dailyRetraining } from '../tradingBot.js';

export function setupScheduler() {
  // a) A cada 2 horas: coleta métricas do mercado global e Fear & Greed
  cron.schedule('0 */2 * * *', async () => {
    try {
      // 1. Coleta e salva métricas de mercado
      const m = await fetchMetrics(process.env.COINSTATS_API_KEY);
      await query(
        `INSERT INTO market_metrics (captured_at, volume_24h, market_cap, btc_dominance, market_cap_change, volume_change, btc_dominance_change)
         VALUES($1,$2,$3,$4,$5,$6,$7)`,
        [m.captured_at, m.volume_24h, m.market_cap, m.btc_dominance, m.market_cap_change, m.volume_change, m.btc_dominance_change]
      );

      // 2. Coleta e salva Fear & Greed
      const fg = await fetchFearGreed(process.env.COINSTATS_API_KEY);
      await query(
        `INSERT INTO fear_greed (captured_at, value, value_classification, timestamp)
         VALUES($1,$2,$3,$4)`,
        [fg.captured_at, fg.value, fg.value_classification, fg.timestamp]
      );

      console.log('[CRON] CoinStats: market_metrics e fear_greed coletados.');
    } catch (err) {
      console.error('[CRON] Erro ao salvar market_metrics ou fear_greed:', err);
    }
  });

  // b) Diariamente à meia-noite UTC: fine-tuning do bot
  cron.schedule('0 0 * * *', dailyRetraining);

  // c) Diariamente às 01:00: limpar sinais mais antigos que 72h
  cron.schedule('0 1 * * *', async () => {
    try {
      await query(`DELETE FROM signals WHERE captured_at < NOW() - INTERVAL '72 hours'`);
      console.log('[CRON] Signals antigos removidos.');
    } catch (err) {
      console.error('[CRON] Erro ao limpar signals antigas:', err);
    }
  });
}
