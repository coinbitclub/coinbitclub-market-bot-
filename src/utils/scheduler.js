// src/utils/scheduler.js

import cron from 'node-cron';
// Pool de conexões compartilhado
import { query } from '../databaseService.js';

// Funções externas que devem existir no seu projeto
import { dailyRetraining } from '../tradingBot.js';                  // retraina IA
import { getFearGreedAndDominance } from '../services/coinstatsService.js'; // métricas CoinStats
import { sendReport } from '../services/reportService.js';          // dispara relatórios

export function setupScheduler() {
  // 1) A cada hora, no minuto zero: apaga sinais com mais de 72h
  cron.schedule('0 * * * *', async () => {
    try {
      await query(
        "DELETE FROM signals WHERE created_at < NOW() - INTERVAL '72 hours'"
      );
      console.log('[Scheduler] Limpeza de sinais antigos – OK');
    } catch (err) {
      console.error('[Scheduler] Erro ao limpar sinais antigos:', err);
    }
  });

  // 2) Diariamente à meia-noite UTC: re-treina a IA
  cron.schedule('0 0 * * *', async () => {
    try {
      await dailyRetraining();
      console.log('[Scheduler] Retraining diário – OK');
    } catch (err) {
      console.error('[Scheduler] Erro no retraining diário:', err);
    }
  });

  // 3) A cada 30 minutos: busca Fear & Greed e Dominância BTC da CoinStats e armazena no DB
  cron.schedule('*/30 * * * *', async () => {
    try {
      const { fearGreed, dominance } = await getFearGreedAndDominance(process.env.COINSTATS_API_KEY);
      await query(
        'INSERT INTO fear_greed(captured_at, value) VALUES ($1,$2)',
        [new Date(), fearGreed]
      );
      await query(
        'INSERT INTO btc_dominance(captured_at, value) VALUES ($1,$2)',
        [new Date(), dominance]
      );
      console.log('[Scheduler] Métricas CoinStats – OK', { fearGreed, dominance });
    } catch (err) {
      console.error('[Scheduler] Erro ao buscar métricas CoinStats:', err);
    }
  });

  // 4) Relatórios em horários das bolsas asiáticas (horário UTC):
  //    - Abertura Tóquio (00:00 UTC)
  cron.schedule('0 0 * * *', async () => {
    try {
      await sendReport('asia_open');
      console.log('[Scheduler] Relatório abertura Ásia – OK');
    } catch (err) {
      console.error('[Scheduler] Erro no relatório abertura Ásia:', err);
    }
  });
  //    - Fechamento Tóquio (06:00 UTC)
  cron.schedule('0 6 * * *', async () => {
    try {
      await sendReport('asia_close');
      console.log('[Scheduler] Relatório fechamento Ásia – OK');
    } catch (err) {
      console.error('[Scheduler] Erro no relatório fechamento Ásia:', err);
    }
  });

  // 5) Relatório de macroeconomia americana (12:30 UTC de segunda a sexta)
  cron.schedule('30 12 * * 1-5', async () => {
    try {
      await sendReport('us_macro');
      console.log('[Scheduler] Relatório macro EUA – OK');
    } catch (err) {
      console.error('[Scheduler] Erro no relatório macro EUA:', err);
    }
  });
}
