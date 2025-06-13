import cron    from 'node-cron';
import { query } from '../databaseService.js';
import {
  getFearGreedAndDominance,
  fetchMetrics
} from '../services/coinstatsService.js';
import { dailyRetraining } from '../tradingBot.js';

/**
 * Configura as tarefas agendadas do sistema.
 */
export function setupScheduler() {
  // 1) Limpar sinais antigos (72h)
  cron.schedule('0 * * * *', async () => {
    await query(
      `DELETE FROM signals WHERE created_at < NOW() - INTERVAL '72 hours'`
    );
    console.log('[Scheduler] Old signals purged');
  });

  // 2) Buscar métricas da CoinStats a cada hora (minuto 5)
  cron.schedule('5 * * * *', async () => {
    try {
      const m = await fetchMetrics(process.env.COINSTATS_API_KEY);
      await query(
        `INSERT INTO market_metrics
         (captured_at, volume_24h, market_cap, dominance, altcoin_season, rsi_market)
         VALUES ($1,$2,$3,$4,$5,$6)`,
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

  // 3) Re-treinamento diário da IA (ex: 02:00 UTC)
  cron.schedule('0 2 * * *', async () => {
    try {
      await dailyRetraining();
      console.log('[Scheduler] dailyRetraining executed');
    } catch (err) {
      console.error('[Scheduler] dailyRetraining error', err);
    }
  });

  // --- aqui você pode adicionar outras tasks, ex:
  // • alertas em abertura/fechamento das bolsas asiáticas
  // • acompanhamento de notícias macro
  // • relatórios periódicos por e-mail/Slack
}
