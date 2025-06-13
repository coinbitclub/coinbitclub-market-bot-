/* =============================================
   src/webhooks.js
   ============================================= */
import express from 'express';
import { logger } from './logger.js';
import { parseSignal } from './signals.js';
import { placeBybitOrder, placeBinanceOrder } from './exchangeService.js';

const router = express.Router();

router.post('/webhook/signal', async (req, res) => {
  try {
    const s = parseSignal(req.body);
    if (s.diffBtcEma7>=0.3 && s.cruzouAcimaEma9) {
      await placeBybitOrder({ ...s, apiKey: process.env.BYBIT_API_KEY, apiSecret: process.env.BYBIT_API_SECRET, tpPercent: s.leverage, slPercent: 2*s.leverage });
      return res.status(200).send('LONG executed');
    }
    if (s.diffBtcEma7<=-0.3 && s.cruzouAbaixoEma9) {
      await placeBybitOrder({ ...s, apiKey: process.env.BYBIT_API_KEY, apiSecret: process.env.BYBIT_API_SECRET, side:'Sell', tpPercent: s.leverage, slPercent: 2*s.leverage });
      return res.status(200).send('SHORT executed');
    }
    res.status(200).send('No action');
  } catch (err) {
    logger.error(err.stack);
    res.status(500).send('Error');
  }
});

router.post('/webhook/dominance', (req,res)=>res.send('OK'));

export default router;
