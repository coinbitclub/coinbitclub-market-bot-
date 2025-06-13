/* ===========================================
   src/utils/scheduler.js
   =========================================== */
import cron from 'node-cron';
import { fetchMetrics, getFearGreedAndDominance } from '../services/coinstatsService.js';
import { query } from '../databaseService.js';
import { dailyRetraining } from '../tradingBot.js';

export function setupScheduler() {
  // a) A cada hora 🕒 fetchMetrics → market_metrics
  cron.schedule('0 * * * *', async () => {
    try {
      const m = await fetchMetrics(process.env.COINSTATS_API_KEY);
      await query(
        `INSERT INTO market_metrics (captured_at, volume_24h, market_cap, dominance, altcoin_season, rsi_market)
         VALUES($1,$2,$3,$4,$5,$6)`,
        [m.captured_at, m.volume_24h, m.market_cap, m.dominance, m.altcoin_season, m.rsi_market]
      );
    } catch (err) {
      console.error('Erro ao salvar market_metrics:', err);
    }
  });

  // b) Diariamente à meia-noite UTC 🔄 fine-tuning
  cron.schedule('0 0 * * *', dailyRetraining);

  // c) Diariamente às 01:00 → limpar sinais mais antigos que 72h
  cron.schedule('0 1 * * *', async () => {
    try {
      await query(`DELETE FROM signals WHERE captured_at < NOW() - INTERVAL '72 hours'`);
    } catch (err) {
      console.error('Erro ao limpar signals antigas:', err);
    }
  });
}
