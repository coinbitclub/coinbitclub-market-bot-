// market-bot/src/coinstarsService.js
import axios from 'axios';

const BASE_URL = 'https://openapiv1.coinstats.app/insights';
const API_KEY  = process.env.COINSTATS_API_KEY;

export async function getFearGreedIndexAndSave(pool) {
  try {
    const res = await axios.get(`${BASE_URL}/fear-and-greed`, {
      headers: {
        'X-API-KEY': API_KEY,
        'accept':    'application/json'
      }
    });
    await pool.query(
      `INSERT INTO coinstats_fear_greed (received_at, raw_payload) VALUES (NOW(), $1)`,
      [JSON.stringify(res.data)]
    );
    return res.data;
  } catch (err) {
    console.error('Erro ao buscar Fear & Greed:', err.message);
    throw err;
  }
}

export async function getBTCDominanceAndSave(pool) {
  try {
    const res = await axios.get(`${BASE_URL}/btc-dominance`, {
      headers: {
        'X-API-KEY': API_KEY,
        'accept':    'application/json'
      }
    });
    await pool.query(
      `INSERT INTO coinstats_btc_dominance (received_at, raw_payload) VALUES (NOW(), $1)`,
      [JSON.stringify(res.data)]
    );
    return res.data;
  } catch (err) {
    console.error('Erro ao buscar BTC Dominance:', err.message);
    throw err;
  }
}
