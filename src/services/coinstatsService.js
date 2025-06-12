import axios from 'axios';
import db from './databaseService.js';

tconst BASE = 'https://openapiv1.coinstats.app/insights';

export async function fetchAndStoreDominance() {
  const url = `${BASE}/btc-dominance`;
  const resp = await axios.get(url);
  await db.insert('coinstats_btc_dominance', resp.data);
}
export async function fetchAndStoreFearGreed() {
  const url = `${BASE}/fear-and-greed`;
  const resp = await axios.get(url);
  await db.insert('coinstats_fear_greed', resp.data);
}
