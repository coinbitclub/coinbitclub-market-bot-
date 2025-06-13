import express from 'express';
import { logger } from './logger.js';
import { parseSignal } from './signals.js';
import { placeBybitOrder, placeBinanceOrder } from './exchangeService.js';
import { getFearGreedAndDominance } from './coinstatsService.js';
import { query } from './databaseService.js';

const router = express.Router();

// PERSISTÊNCIA DE SINAIS
router.post('/webhook/signal', async (req, res) => {
  try {
    logger.info(`Signal payload: ${JSON.stringify(req.body)}`);
    // Gravar no DB
    await query(
      `INSERT INTO signals (ticker, signal_time, diff_btc_ema7, cruzou_acima_ema9, cruzou_abaixo_ema9, raw_payload)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        req.body.ticker,
        new Date(req.body.time),
        Number(req.body.diff_btc_ema7),
        Boolean(req.body.cruzou_acima_ema9),
        Boolean(req.body.cruzou_abaixo_ema9),
        req.body
      ]
    );
    const s = parseSignal(req.body);
    // Lógica de execução de ordens
    if (s.diffBtcEma7 >= 0.3 && s.cruzouAcimaEma9) {
      await placeBybitOrder({
        ...s,
        apiKey: process.env.BYBIT_API_KEY,
        apiSecret: process.env.BYBIT_API_SECRET,
        tpPercent: s.leverage,
        slPercent: 2 * s.leverage
      });
      return res.status(200).send('LONG executed');
    }
    if (s.diffBtcEma7 <= -0.3 && s.cruzouAbaixoEma9) {
      await placeBybitOrder({
        ...s,
        apiKey: process.env.BYBIT_API_KEY,
        apiSecret: process.env.BYBIT_API_SECRET,
        side: 'Sell',
        tpPercent: s.leverage,
        slPercent: 2 * s.leverage
      });
      return res.status(200).send('SHORT executed');
    }
    return res.status(200).send('No action');
  } catch (err) {
    logger.error(`Signal error: ${err.stack}`);
    return res.status(500).send('Error');
  }
});

// PERSISTÊNCIA DE DOMINÂNCIA
router.post('/webhook/dominance', async (req, res) => {
  try {
    logger.info(`Dominance payload: ${JSON.stringify(req.body)}`);
    const payload = req.body;
    // Opcional: gravar em signals ou tabela específica de dominância
    await query(
      `INSERT INTO signals (ticker, signal_time, raw_payload)
       VALUES ($1,$2,$3)`,
      [payload.ticker, new Date(payload.time), payload]
    );
    return res.status(200).send('Dominance signal OK');
  } catch (err) {
    logger.error(`Dominance error: ${err.stack}`);
    return res.status(500).send('Error');
  }
});

// API CoinStats
router.get('/api/fear-greed', async (req, res) => {
  try {
    const { fearGreed } = await getFearGreedAndDominance(process.env.COINSTATS_API_KEY);
    return res.json({ fearGreed });
  } catch (e) {
    logger.error(`FearGreed error: ${e.message}`);
    return res.status(500).json({ error: 'Could not fetch Fear & Greed' });
  }
});
router.get('/api/btc-dominance', async (req, res) => {
  try {
    const { dominance } = await getFearGreedAndDominance(process.env.COINSTATS_API_KEY);
    return res.json({ dominance });
  } catch (e) {
    logger.error(`Dominance error: ${e.message}`);
    return res.status(500).json({ error: 'Could not fetch Dominance' });
  }
});

export default router;
