/* ========== src/tradingBot.js ========== */

import OpenAI from 'openai';
import { getFearGreedAndDominance } from './services/coinstatsService.js';
import { logger } from './logger.js';
import { query } from './databaseService.js';
import { fetchOpenPositions, closePosition } from './exchangeService.js';

const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * 1) Executa diariamente:
 *    - coleta Fear&Greed e Dominância
 *    - armazena no banco
 *    - dispara fine-tune / re-treinamento da IA
 */
export async function dailyRetraining() {
  try {
    const { fearGreed, dominance } = await getFearGreedAndDominance(process.env.COINSTATS_API_KEY);
    logger.info(`Retraining IA — F&G=${fearGreed} Dominance=${dominance}`);

    // Salva Fear & Greed
    await query(
      'INSERT INTO fear_greed(captured_at, value) VALUES ($1, $2)',
      [new Date(), fearGreed]
    );
    // Salva Dominância
    await query(
      'INSERT INTO market_metrics(captured_at, dominance) VALUES ($1, $2)',
      [new Date(), dominance]
    );

    // Aqui você pode chamar a API de fine-tune do OpenAI:
    // await ai.fineTunes.create({ /* sua configuração de fine-tune */ });

  } catch (err) {
    logger.error(`Erro em dailyRetraining: ${err.stack || err}`);
  }
}

/**
 * 2) Monitora posições abertas e fecha
 *    - lucro ≥3%
 *    - sinal de dominância revertendo ±0.1% (chega via webhook)
 *    - explosões de volatilidade (ATR instantâneo > 2× ATR médio) ou volume anômalo
 */
export async function monitorOpenPositions() {
  try {
    const positions = await fetchOpenPositions();
    for (const pos of positions) {
      const { id, entryPrice, currentPrice, leverage, symbol, side } = pos;
      const profitPct = ((currentPrice - entryPrice) / entryPrice) * 100 * (side === 'LONG' ? 1 : -1);

      // 1) lucro >= 3%
      if (profitPct >= 3) {
        logger.info(`Fechando posição ${id} de ${symbol} por lucro ≥3%`);
        await closePosition(id);
        continue;
      }

      // 2) (se você receber diffDominance e cruzamento EMA7 no payload do webhook, trate aqui)

      // 3) (aqui poderia entrar a lógica de ATR instantâneo e volume anômalo)

    }
  } catch (err) {
    logger.error(`Erro em monitorOpenPositions: ${err.stack || err}`);
  }
}
