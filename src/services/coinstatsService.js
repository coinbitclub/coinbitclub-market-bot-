// src/services/coinstatsService.js
import axios from 'axios';
import db from '../databaseService.js';

export async function getBTCDominanceAndSave() {
  const { data } = await axios.get('https://openapiv1.coinstats.app/insights/btc-dominance');
  await db.query(
    `INSERT INTO coinstats_btc_dominance(raw_payload) VALUES($1)`,
    [data]
  );
  console.log('[Cron] BTC Dominance salvo');
}

export async function getFearAndGreedAndSave() {
  const { data } = await axios.get('https://openapiv1.coinstats.app/insights/fear-and-greed');
  await db.query(
    `INSERT INTO coinstats_fear_greed(raw_payload) VALUES($1)`,
    [data]
  );
  console.log('[Cron] Fear & Greed salvo');
}
