/* ========== src/tradingBot.js ========== */
import { getFearGreedAndDominance } from './coinstatsService.js';
import { logger } from './logger.js';
import { query } from './databaseService.js';
import OpenAI from 'openai';
import { fetchOpenPositions, closePosition } from './exchangeService.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function dailyRetraining() {
  const { fearGreed, dominance } = await getFearGreedAndDominance(process.env.COINSTATS_API_KEY);
  logger.info(`Retraining IA — FearGreed=${fearGreed} Dominance=${dominance}`);
  // ... lógica de fine-tuning ou ajuste dinâmico
}

export async function monitorOpenPositions() {
  try {
    const positions = await fetchOpenPositions();
    for (const pos of positions) {
      const { id, entryPrice, currentPrice, leverage, symbol, side } = pos;
      const profitPct = ((currentPrice - entryPrice) / entryPrice) * 100 * (side === 'LONG' ? 1 : -1);
      // 1) lucro >= 3%
      // 2) diff Dominância×EMA7 revertendo ±0.1% (já enviado como alerta no payload)
      // 3) alteração brusca ≔ ATR_instant > 2×ATR_media e volume anômalo
      if (profitPct >= 3) {
        logger.info(`Fechando posição ${id} de ${symbol} por lucro ≥3%`);
        await closePosition(id);
      }
      // ... lógica para dominância e volatilidade extra se receber dados via webhook
    }
  } catch (err) {
    logger.error(`Erro em monitorOpenPositions: ${err.message}`);
  }
}
