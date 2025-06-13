import axios from 'axios';
import { query } from './databaseService.js';

export async function fetchAndSaveMetrics() {
  const url = `https://api.coinstats.app/public/v1/markets`;
  const { data } = await axios.get(url);
  // data.totalMarketCap, data.volume, data.btcDominance etc
  const now = new Date().toISOString();

  // Grava em market_metrics
  const sqlMetrics = `
    INSERT INTO market_metrics(
      captured_at, volume_24h, market_cap, dominance, altcoin_season, rsi_market
    ) VALUES($1,$2,$3,$4,$5,$6)
  `;
  await query(sqlMetrics, [
    now,
    data.totalVolume24h,
    data.totalMarketCap,
    data.btcDominance,
    data.altcoinSeason,
    data.rsiMarket
  ]);

  // Busca Fear & Greed + grava
  const urlFg = `https://openapiv1.coinstats.app/public/v1/global/indices`;
  const { data: fg } = await axios.get(urlFg, { params:{ key: process.env.COINSTATS_API_KEY }});
  const fgValue = fg.fearGreed;
  const sqlFG = `INSERT INTO fear_greed(captured_at, value) VALUES($1,$2)`;
  await query(sqlFG, [now, fgValue]);
}

// Apenas para o webhook /dominance (recebe payload do TV)
export async function saveDominance(payload) {
  const { ticker, time, btcDominance, ema7, diffPct, signal } = payload;
  await query(
    `INSERT INTO btc_dominance_signals (
       ticker, captured_at, dominance_pct, ema7, diff_pct, signal
     ) VALUES($1,$2,$3,$4,$5,$6)`,
    [ticker, time, btcDominance, ema7, diffPct, signal]
  );
}
