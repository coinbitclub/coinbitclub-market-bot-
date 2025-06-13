// src/tradingBot.js
import { getFearGreedAndDominance } from './services/coinstatsService.js';
import { logger }                  from './logger.js';
import OpenAI                      from 'openai';
import { fetchOpenPositions, closePosition } from './exchangeService.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function dailyRetraining() {
  const { fearGreed, dominance } = await getFearGreedAndDominance(process.env.COINSTATS_API_KEY);
  logger.info(`Retraining IA — FearGreed=${fearGreed} Dominance=${dominance}`);
  // ... sua lógica de fine-tune aqui
}

export async function monitorOpenPositions() {
  try {
    const positions = await fetchOpenPositions();
    for (const pos of positions) {
      const { id, entryPrice, currentPrice, leverage, symbol, side } = pos;
      const profitPct = ((currentPrice - entryPrice) / entryPrice) * 100 * (side === 'LONG' ? 1 : -1);

      if (profitPct >= 3) {
        logger.info(`Fechando posição ${id} de ${symbol} por lucro ≥3%`);
        await closePosition(id);
      }
      // ... adicionar dominância/volatilidade se vier via webhook
    }
  } catch (err) {
    logger.error(`Erro em monitorOpenPositions: ${err.message}`);
  }
}
