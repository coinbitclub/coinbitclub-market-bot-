// src/utils/scheduler.js
import cron  from 'node-cron';
import { query } from '../databaseService.js';
import {
  fetchMetrics,
  getFearGreedAndDominance
} from '../services/coinstatsService.js';
import { dailyRetraining } from '../tradingBot.js';

export function setupScheduler() {
  // 1) Limpar signals >72h todo início de hora
  cron.schedule('0 * * * *', async () => {
    await query(`DELETE FROM signals WHERE created_at < NOW() - INTERVAL '72 hours'`);
    console.log('[Scheduler] Old signals purged');
  });

  // 2) Gravar market_metrics a cada hora, minuto 05
  cron.schedule('5 * * * *', async () => {
    try {
      const m = await fetchMetrics(process.env.COINSTATS_API_KEY);
      await query(
        `INSERT INTO market_metrics
          (captured_at, volume_24h, market_cap, dominance, altcoin_season, rsi_market)
         VALUES($1,$2,$3,$4,$5,$6)`,
        [
          m.captured_at,
          m.volume_24h,
          m.market_cap,
          m.dominance,
          m.altcoin_season,
          m.rsi_market
        ]
      );
      console.log('[Scheduler] Market metrics recorded');
    } catch (err) {
      console.error('[Scheduler] fetchMetrics error', err);
    }
  });

  // 3) Re-treinamento IA diário às 02:00 UTC
  cron.schedule('0 2 * * *', async () => {
    try {
      await dailyRetraining();
      console.log('[Scheduler] dailyRetraining executed');
    } catch (err) {
      console.error('[Scheduler] dailyRetraining error', err);
    }
  });

  // ➕ Aqui você pode adicionar:
  //   • alertas de abertura/fechamento de bolsas asiáticas
  //   • checks de notícias macro
  //   • relatórios por e-mail/Slack, etc.
}
