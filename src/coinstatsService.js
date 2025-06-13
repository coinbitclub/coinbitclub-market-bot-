import axios from 'axios';
import { query } from './databaseService.js';
import { logger } from './logger.js';

export async function fetchAndSaveMetrics() {
  // 1) Busca no CoinStats
  const [fgRes, domRes] = await Promise.all([
    axios.get('https://openapiv1.coinstats.app/insights/fear-and-greed'),
    axios.get('https://openapiv1.coinstats.app/insights/btc-dominance')
  ]);
  const fearGreed  = fgRes.data.value;
  const dominance  = domRes.data.value;
  const now        = new Date();

  // 2) Persiste no fear_greed
  await query(
    `INSERT INTO fear_greed (captured_at, value) VALUES ($1, $2)`,
    [now, fearGreed]
  );

  // 3) Persiste no market_metrics
  await query(
    `INSERT INTO market_metrics 
       (captured_at, volume_24h, market_cap, dominance, altcoin_season, rsi_market)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [ now,
      fgRes.data.volume_24h,
      fgRes.data.market_cap,
      dominance,
      fgRes.data.altcoin_season,
      fgRes.data.rsi_market
    ]
  );

  logger.info(`Saved metrics: F&G=${fearGreed}%, Dominance=${dominance}%`);
}
