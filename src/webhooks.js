import express from 'express';
import { logger } from './logger.js';
import { parseSignal } from './signals.js';
import { placeBybitOrder, placeBinanceOrder } from './exchangeService.js';
import { getFearGreedAndDominance } from './coinstatsService.js';

const router = express.Router();

// === Webhook: TradingView price-action signal ===
router.post('/webhook/signal', async (req, res) => {
  try {
    logger.info(`Signal payload received: ${JSON.stringify(req.body)}`);
    const s = parseSignal(req.body);
    // LONG
    if (s.diffBtcEma7 >= 0.3 && s.cruzouAcimaEma9) {
      await placeBybitOrder({
        ...s,
        apiKey: process.env.BYBIT_API_KEY,
        apiSecret: process.env.BYBIT_API_SECRET,
        tpPercent: s.leverage,
        slPercent: 2 * s.leverage
      });
      logger.info(`LONG order executed for ${s.symbol}`);
      return res.status(200).send('LONG executed');
    }
    // SHORT
    if (s.diffBtcEma7 <= -0.3 && s.cruzouAbaixoEma9) {
      await placeBybitOrder({
        ...s,
        apiKey: process.env.BYBIT_API_KEY,
        apiSecret: process.env.BYBIT_API_SECRET,
        side: 'Sell',
        tpPercent: s.leverage,
        slPercent: 2 * s.leverage
      });
      logger.info(`SHORT order executed for ${s.symbol}`);
      return res.status(200).send('SHORT executed');
    }
    return res.status(200).send('No action');
  } catch (err) {
    logger.error(`Webhook signal error: ${err.stack}`);
    return res.status(500).send('Error');
  }
});

// === Webhook: TradingView BTC Dominance alert ===
router.post('/webhook/dominance', (req, res) => {
  logger.info(`Dominance payload received: ${JSON.stringify(req.body)}`);
  return res.status(200).send('Dominance signal OK');
});

// === API: Fear & Greed Index ===
router.get('/api/fear-greed', async (req, res) => {
  try {
    const { fearGreed } = await getFearGreedAndDominance(process.env.COINSTATS_API_KEY);
    return res.json({ fearGreed });
  } catch (e) {
    logger.error(`Error fetching Fear & Greed: ${e.message}`);
    return res.status(500).json({ error: 'Could not fetch Fear & Greed' });
  }
});

// === API: BTC Dominance ===
router.get('/api/btc-dominance', async (req, res) => {
  try {
    const { dominance } = await getFearGreedAndDominance(process.env.COINSTATS_API_KEY);
    return res.json({ dominance });
  } catch (e) {
    logger.error(`Error fetching BTC Dominance: ${e.message}`);
    return res.status(500).json({ error: 'Could not fetch BTC dominance' });
  }
});

export default router;
