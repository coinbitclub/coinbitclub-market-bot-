import cron from 'node-cron';
import { query } from '../databaseService.js';
import { dailyRetraining } from '../tradingBot.js';
import { getFearGreedAndDominance } from '../services/coinstatsService.js';
import { sendReport } from '../services/reportService.js';

export function setupScheduler() {
  // 1) limpa sinais >72h a cada hora
  cron.schedule('0 * * * *', async () => {
    try {
      await query("DELETE FROM signals WHERE captured_at < NOW() - INTERVAL '72 hours'");
      console.log('[Scheduler] Sinais antigos limpos');
    } catch (e) {
      console.error('[Scheduler] Erro limpando sinais:', e);
    }
  });

  // 2) retraining diário à 00:00 UTC
  cron.schedule('0 0 * * *', async () => {
    try {
      await dailyRetraining();
      console.log('[Scheduler] Retraining diário OK');
    } catch (e) {
      console.error('[Scheduler] Erro retraining:', e);
    }
  });

  // 3) CoinStats a cada 30 minutos
  cron.schedule('*/30 * * * *', async () => {
    try {
      const { fearGreed, dominance } = await getFearGreedAndDominance(process.env.COINSTATS_API_KEY);
      await query('INSERT INTO fear_greed(captured_at,value) VALUES($1,$2)', [new Date(), fearGreed]);
      await query('INSERT INTO market_metrics(captured_at,dominance) VALUES($1,$2)', [new Date(), dominance]);
      console.log('[Scheduler] Métricas CoinStats inseridas');
    } catch (e) {
      console.error('[Scheduler] Erro CoinStats:', e);
    }
  });

  // 4) Relatórios Ásia (Open/Close)
  cron.schedule('0 0 * * *', async () => { await sendReport('asia_open'); });
  cron.schedule('0 6 * * *', async () => { await sendReport('asia_close'); });

  // 5) Relatório macro EUA (Seg–Sex 12:30 UTC)
  cron.schedule('30 12 * * 1-5', async () => { await sendReport('us_macro'); });

  console.log('[Scheduler] Tarefas agendadas');
}
