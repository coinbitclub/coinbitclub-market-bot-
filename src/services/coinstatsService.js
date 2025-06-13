import axios from 'axios';
import { query } from '../databaseService.js';

export async function getFearGreedAndDominance(apiKey) {
  const res = await axios.get('https://openapiv1.coinstats.app/insights', {
    params: { key: apiKey }
  });
  return {
    fearGreed: res.data.fearGreed,
    dominance: res.data.dominance
  };
}

export async function saveDominance(payload) {
  const sql = `
    INSERT INTO btc_dominance_signals(
      ticker, captured_at, dominance_pct, ema7, diff_pct, signal
    ) VALUES($1,$2,$3,$4,$5,$6)`;
  await query(sql, [
    payload.ticker,
    new Date(payload.time),
    parseFloat(payload.btc_dominance || payload.dominance),
    parseFloat(payload.ema_7 || payload.ema7),
    parseFloat(payload.diff_pct),
    payload.sinal || payload.signal
  ]);
}
