import axios from 'axios';
import { query } from './databaseService.js';
import { logger } from './logger.js';

// Fetch latest Fear & Greed and BTC dominance
export async function getFearGreedAndDominance(apiKey) {
  const resp = await axios.get('https://api.coinstats.app/public/v1/fear-and-greed', {
    headers: { Authorization: apiKey }
  });
  return {
    fearGreed: resp.data.fear_and_greed.value,
    dominance: resp.data.btc_dominance.value
  };
}

// Insert Fear & Greed into DB
export async function storeFearGreed() {
  const now = new Date();
  const { fearGreed } = await getFearGreedAndDominance(process.env.COINSTATS_API_KEY);
  await query(
    'INSERT INTO fear_greed (captured_at, value) VALUES ($1, $2)',
    [now, fearGreed]
  );
}

// Insert market metrics into DB
export async function storeMarketMetrics() {
  const now = new Date();
  // Assume fetchMetrics() returns { volume24h, marketCap, dominance, altcoinSeason, rsiMarket }
  const { volume24h, marketCap, dominance, altcoinSeason, rsiMarket } = await fetchMetrics(); 
  await query(
    'INSERT INTO market_metrics (captured_at, volume_24h, market_cap, dominance, altcoin_season, rsi_market) VALUES ($1, $2, $3, $4, $5, $6)',
    [now, volume24h, marketCap, dominance, altcoinSeason, rsiMarket]
  );
}
