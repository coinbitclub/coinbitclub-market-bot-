// src/services/coinstatsService.js
import axios from 'axios';
import { query } from './databaseService.js';

const API_KEY = process.env.COINSTATS_API_KEY;
const BASE = 'https://openapiv1.coinstats.app';

async function get(path) {
  return axios.get(BASE + path, {
    headers: { 'X-API-KEY': API_KEY }
  }).then(r => r.data);
}

export async function fetchAndSaveDominance() {
  const data = await get('/insights/btc-dominance');
  // processa data.data (array de [ts, value])
  // insere em dominance_daily
}

export async function fetchAndSaveFearGreed() {
  const { now } = await get('/insights/fear-and-greed');
  await query(
    `INSERT INTO fear_greed(user_id, value, classification, timestamp)
     VALUES (NULL, $1, $2, to_timestamp($3))`,
    [now.value, now.value_classification, now.timestamp]
  );
}

export async function fetchAndSaveMarkets() {
  const { marketCap, volume, btcDominance } = await get('/markets');
  await query(
    `INSERT INTO coinstats_metrics(user_id, marketcap, volume, btc_dominance, timestamp)
     VALUES (NULL, $1, $2, $3, now())`,
    [marketCap, volume, btcDominance]
  );
}
