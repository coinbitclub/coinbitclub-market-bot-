// src/services/coinstatsService.js
import axios from 'axios';

const BASE = 'https://api.coinstats.app/public/v1';

export async function getFearGreedIndexAndSave(pool) {
  const { data } = await axios.get(`${BASE}/fear-and-greed`);
  await pool.query(
    'INSERT INTO coinstats_fear_greed (raw_payload) VALUES ($1)',
    [JSON.stringify(data)]
  );
}

export async function getBTCDominanceAndSave(pool) {
  const { data } = await axios.get(`${BASE}/btc-dominance`);
  await pool.query(
    'INSERT INTO coinstats_btc_dominance (raw_payload) VALUES ($1)',
    [JSON.stringify(data)]
  );
}
