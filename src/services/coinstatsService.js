import axios from 'axios';
import db from '../db.js';

const API_KEY = process.env.COINSTATS_API_KEY;

export async function fetchAndSaveDominance() {
  const res = await axios.get('https://openapiv1.coinstats.app/insights/btc-dominance', {
    headers: { 'X-API-KEY': API_KEY }
  });
  // Adapte para os campos do seu banco
  const { dominance, timestamp } = res.data;
  await db.query(
    'INSERT INTO dominance (dominance, timestamp) VALUES ($1, $2)',
    [dominance, timestamp]
  );
}

export async function fetchAndSaveMarkets() {
  const res = await axios.get('https://openapiv1.coinstats.app/markets', {
    headers: { 'X-API-KEY': API_KEY }
  });
  // Salve no banco os campos necessários
  for (const market of res.data.markets) {
    await db.query(
      'INSERT INTO markets (id, name, price, volume) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
      [market.id, market.name, market.price, market.volume]
    );
  }
}

export async function fetchAndSaveFearGreed() {
  const res = await axios.get('https://openapiv1.coinstats.app/insights/fear-and-greed', {
    headers: { 'X-API-KEY': API_KEY }
  });
  const { value, timestamp } = res.data;
  await db.query(
    'INSERT INTO fear_greed (value, timestamp) VALUES ($1, $2)',
    [value, timestamp]
  );
}
