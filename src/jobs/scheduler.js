import { shouldEnterLong, shouldExitLong } from '../services/signalsService.js';
import { placeOrder, closeOrder, fetchOpenOrders } from '../services/bybitService.js';

cron.schedule('*/5 * * * *', async () => {
  const marketData = await getMarketData();               // BTC.D, F&G, candles, etc.
  const signals    = calculateSignals(marketData);        // long/short/macrosinal
  const openOrders = await fetchOpenOrders(user);

  // entrada
  if (signals.altcoins === 'LONG' && shouldEnterLong(signals.pairData)) {
    await placeOrder(user, { side: 'Buy', qty: …, sl: …, tp: … });
  }

  // saída
  for (let o of openOrders) {
    if (o.side === 'Buy' && shouldExitLong({ price: o.currentPrice, entryPrice: o.price, volatility: marketData.volatility })) {
      await closeOrder(user, o.id);
    }
    // mesma coisa para SHORT…
  }
});
