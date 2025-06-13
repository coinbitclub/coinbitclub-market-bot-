import axios from 'axios';
import { query } from './databaseService.js';
import { logger } from './logger.js';

export async function getFearGreedAndDominance(apiKey) {
const [fgRes, domRes] = await Promise.all([
axios.get('https://openapiv1.coinstats.app/insights/fear-and-greed'),
axios.get('https://openapiv1.coinstats.app/insights/btc-dominance')
]);
return { fearGreed: fgRes.data.value, dominance: domRes.data.value };
}

export async function fetchAndSaveMetrics() {
const [fgRes, domRes] = await Promise.all([
axios.get('https://openapiv1.coinstats.app/insights/fear-and-greed'),
axios.get('https://openapiv1.coinstats.app/insights/btc-dominance')
]);
const now = new Date();
await query(INSERT INTO fear_greed (captured_at, value) VALUES ($1,$2), [now, fgRes.data.value]);
await query(
INSERT INTO market_metrics (captured_at, volume_24h, market_cap, dominance, altcoin_season, rsi_market)
     VALUES ($1,$2,$3,$4,$5,$6),
[now, fgRes.data.volume_24h, fgRes.data.market_cap, domRes.data.value, fgRes.data.altcoin_season, fgRes.data.rsi_market]
);
logger.info(Saved metrics F&G=${fgRes.data.value}, Dom=${domRes.data.value});
}
