/* ========== src/webhooks.js ========== */
import express from 'express';
import { logger } from './logger.js';
import { parseSignal } from './signals.js';
import { placeBybitOrder, placeBinanceOrder } from './exchangeService.js';

const router = express.Router();

router.post('/webhook/signal', async (req, res) => {
  try {
    const sig = parseSignal(req.body);
    // Critério simplificado de entrada: diffDominance>0.3 + crossover de EMA9
    if (sig.diffBtcEma7 >= 0.3 && sig.cruzouAcimaEma9) {
      const result = await placeBybitOrder({ ...sig, apiKey: process.env.BYBIT_API_KEY, apiSecret: process.env.BYBIT_API_SECRET, leverage: sig.leverage });
      logger.info(`Ordem LONG aberta: ${JSON.stringify(result)}`);
      return res.status(200).send('LONG executed');
    }
    if (sig.diffBtcEma7 <= -0.3 && sig.cruzouAbaixoEma9) {
      const result = await placeBybitOrder({ ...sig, apiKey: process.env.BYBIT_API_KEY, apiSecret: process.env.BYBIT_API_SECRET, leverage: sig.leverage, side: 'Sell' });
      logger.info(`Ordem SHORT aberta: ${JSON.stringify(result)}`);
      return res.status(200).send('SHORT executed');
    }
    res.status(200).send('No action');
  } catch (err) {
    logger.error(err.stack);
    res.status(500).send('Error');
  }
});

export default router;
