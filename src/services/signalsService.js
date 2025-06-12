// src/services/signalsService.js
// Regras de entrada e saída de trades

/**
 * Decide se deve entrar em posição LONG
 * @param {{ close: number, ema9: number, macd: number, rsi: number }} data
 * @returns {boolean}
 */
export function shouldEnterLong(data) {
  const { close, ema9, macd, rsi } = data;
  return close > ema9 && macd > 0 && rsi < 76;
}

/**
 * Decide se deve entrar em posição SHORT
 * @param {{ close: number, ema9: number, macd: number, rsi: number }} data
 * @returns {boolean}
 */
export function shouldEnterShort(data) {
  const { close, ema9, macd, rsi } = data;
  return close < ema9 && macd < 0 && rsi > 40;
}

/**
 * Avalia condições de saída de uma posição LONG
 * @param {{ price: number, entryPrice: number, volatility: number }} data
 * @returns {boolean}
 */
export function shouldExitLong(data) {
  const { price, entryPrice, volatility } = data;
  const stopLoss    = entryPrice * (1 - 1.5 * volatility);
  const takeProfit  = entryPrice * (1 + 2 * volatility);
  return price <= stopLoss || price >= takeProfit;
}

/**
 * Avalia condições de saída de uma posição SHORT
 * @param {{ price: number, entryPrice: number, volatility: number }} data
 * @returns {boolean}
 */
export function shouldExitShort(data) {
  const { price, entryPrice, volatility } = data;
  const stopLoss    = entryPrice * (1 + 1.5 * volatility);
  const takeProfit  = entryPrice * (1 - 2 * volatility);
  return price >= stopLoss || price <= takeProfit;
}


// src/jobs/scheduler.js
// Cron job para capturar sinais, avaliar regras e executar ordens na Bybit
import cron from 'node-cron';
import { getLatestDominance, getLatestFearGreed } from '../services/coinstatsService.js';
import { shouldEnterLong, shouldEnterShort, shouldExitLong, shouldExitShort } from '../services/signalsService.js';
import { fetchOpenOrders, placeOrder, closeOrder } from '../services/bybitService.js';
import { fetchAltcoinSignals } from '../services/tradingviewService.js';
import { getVolatility } from '../services/volatilityService.js';

// executa a cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  try {
    // Sinal macro
    const dominance = await getLatestDominance();          // { value: number }
    const fearGreed = await getLatestFearGreed();         // { value: number }
    const volatility = await getVolatility();            // { value: number }

    // Sinal BTC vs ALT
    const macroSignal = dominance.value > 50 && fearGreed.value < 25 && volatility > 0.8
      ? 'LONG_ALT' : dominance.value < 50 && fearGreed.value > 75 && volatility > 0.8
      ? 'SHORT_ALT' : 'NEUTRO';

    // Buscar sinais individuais de altcoins via webhook ou API TradingView
    const altSignals = await fetchAltcoinSignals(); // [{ ticker, close, ema9, macd, rsi }, ...]

    // Ver ordens abertas para cada usuário/conta
    const openOrders = await fetchOpenOrders(); // [{ id, side, symbol, price, userId }, ...]

    // Processa cada altcoin
    for (let s of altSignals) {
      const { ticker, ...data } = s;
      // Entrada LONG
      if (macroSignal === 'LONG_ALT' && shouldEnterLong(data)) {
        await placeOrder({ symbol: ticker, side: 'Buy', userId: s.userId });
      }
      // Entrada SHORT
      if (macroSignal === 'SHORT_ALT' && shouldEnterShort(data)) {
        await placeOrder({ symbol: ticker, side: 'Sell', userId: s.userId });
      }
    }

    // Avaliar saídas
    for (let o of openOrders) {
      const marketPrice = o.currentPrice;
      if (o.side === 'Buy' && shouldExitLong({ price: marketPrice, entryPrice: o.price, volatility })) {
        await closeOrder(o.id, o.userId);
      }
      if (o.side === 'Sell' && shouldExitShort({ price: marketPrice, entryPrice: o.price, volatility })) {
        await closeOrder(o.id, o.userId);
      }
    }

    console.log('Scheduler: ciclo completo executado', new Date().toISOString());
  } catch (err) {
    console.error('Scheduler erro:', err);
  }
});


// src/index.js
// Bootstrapping: importa scheduler e inicia servidor HTTP para webhooks/monitoramento
import express from 'express';
import dotenv from 'dotenv';
import './jobs/scheduler.js';

dotenv.config();
const app = express();
app.use(express.json());

// Rotas de Health-Check
app.get('/health', (req, res) => res.send('OK'));

// Rotas de debug / dados brutos
app.get('/api/fear-greed', async (req, res) => {
  const v = await import('./services/coinstatsService.js').then(m => m.getLatestFearGreed());
  res.json(v);
});
app.get('/api/btc-dominance', async (req, res) => {
  const v = await import('./services/coinstatsService.js').then(m => m.getLatestDominance());
  res.json(v);
});

// Inicia
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 market-bot listening on port ${PORT}`));
