// src/services/coinstatsService.js

import axios from 'axios';
// <<< CORREÇÃO AQUI: caminho para a raiz do src
import { query } from '../databaseService.js';

export async function getFearGreedAndDominance(apiKey) {
  const res = await axios.get(
    `https://api.coinstats.app/public/v1/global?apiKey=${apiKey}`
  );
  const { totalMarketCap, volume24h, dominance, altcoinSeason, fearGreedScore } = res.data;

  const now = new Date();
  // Grava Fear & Greed (se existir)
  if (fearGreedScore !== undefined) {
    await query(
      'INSERT INTO fear_greed(captured_at, value) VALUES($1, $2)',
      [now, fearGreedScore]
    );
  }
  // Grava métricas de mercado
  await query(
    `INSERT INTO market_metrics(
        captured_at,
        volume_24h,
        market_cap,
        dominance,
        altcoin_season
      ) VALUES ($1,$2,$3,$4,$5)`,
    [now, volume24h, totalMarketCap, dominance, altcoinSeason]
  );

  return { fearGreed: fearGreedScore, dominance };
}
