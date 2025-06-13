/* ========== src/utils/scheduler.js ========== */
import cron from 'node-cron';
import { query } from '../databaseService.js';
import { getFearGreedAndDominance, fetchMetrics } from '../services/coinstatsService.js';
import { dailyRetraining, monitorOpenPositions } from '../tradingBot.js';
import { logger } from '../logger.js';

/**
 * Aqui você define todas as suas tarefas agendadas:
 *  • Limpeza de sinais antigos (mais de 72h)
 *  • Coleta de métricas da CoinStats (a cada X minutos)
 *  • Retraining diário da IA
 *  • Monitoramento de posições abertas (a cada minuto)
 *  • Envio de relatórios nos horários de abertura e fechamento das bolsas asiáticas
 *  • Busca de notícias macro diariamente
 */
export function setupScheduler() {
  // 1) Limpar sinais mais antigos que 72h, todo dia à meia-noite
  cron.schedule('0 0 * * *', async () => {
    try {
      await query(
        `DELETE FROM signals
         WHERE created_at < NOW() - INTERVAL '72 hours'`
      );
      logger.info('🧹 Sinais antigos (>72h) limpos com sucesso');
    } catch (err) {
      logger.error(`Falha ao limpar sinais antigos: ${err.message}`);
    }
  });

  // 2) Capturar métricas da CoinStats a cada 5 minutos
  cron.schedule('*/5 * * * *', async () => {
    try {
      const metrics = await fetchMetrics(process.env.COINSTATS_API_KEY);
      // fear/greed
      await query(
        'INSERT INTO fear_greed(captured_at, value) VALUES ($1, $2)',
        [new Date(), metrics.fearGreed]
      );
      // market_metrics
      await query(
        `INSERT INTO market_metrics(
           captured_at, volume_24h, market_cap, dominance, altcoin_season, rsi_market
         ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          new Date(),
          metrics.volume_24h,
          metrics.market_cap,
          metrics.dominance,
          metrics.altcoin_season,
          metrics.rsi_market
        ]
      );
      logger.info('📊 Métricas CoinStats coletadas e salvas');
    } catch (err) {
      logger.error(`Erro ao coletar métricas CoinStats: ${err.message}`);
    }
  });

  // 3) Retraining diário da IA – 00:00 UTC
  cron.schedule('0 0 * * *', dailyRetraining);

  // 4) Monitorar posições abertas a cada minuto
  cron.schedule('* * * * *', monitorOpenPositions);

  // 5) Envio de relatórios nos horários da Ásia (exemplo: 0:00 e 9:00 UTC)
  cron.schedule('0 0 * * *', () => {
    logger.info('📈 Enviando relatório de abertura da Ásia');
    // chamar sua função de relatório aqui...
  });
  cron.schedule('0 9 * * *', () => {
    logger.info('📉 Enviando relatório de fechamento da Ásia');
    // chamar sua função de relatório aqui...
  });

  // 6) Buscar notícias macrodiárias (ex: 12:00 UTC)
  cron.schedule('0 12 * * *', async () => {
    try {
      logger.info('📰 Coletando notícias macroeconômicas');
      // await fetchMacroNews();
    } catch (err) {
      logger.error(`Erro ao buscar notícias macro: ${err.message}`);
    }
  });

  logger.info('⏱️ Scheduler inicializado com todas as tarefas agendadas');
}
