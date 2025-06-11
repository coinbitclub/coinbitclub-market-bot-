import axios from 'axios';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const API_KEY = process.env.COINSTATS_API_KEY;

// Salva Fear & Greed
export async function saveFearGreed() {
  try {
    const url = 'https://openapiv1.coinstats.app/insights/fear-and-greed';
    const resp = await axios.get(url, { headers: { 'X-API-KEY': API_KEY } });
    await pool.query(
      `INSERT INTO coinstats_fear_greed (received_at, raw_payload) VALUES (NOW(), $1)`,
      [JSON.stringify(resp.data)]
    );
    console.log('[CoinStats] Fear & Greed salvo!');
  } catch (e) {
    console.error('Erro salvando Fear & Greed:', e.message);
  }
}

// Salva Dominância BTC
export async function saveBTCDominance() {
  try {
    const url = 'https://openapiv1.coinstats.app/insights/btc-dominance';
    const resp = await axios.get(url, { headers: { 'X-API-KEY': API_KEY } });
    await pool.query(
      `INSERT INTO coinstats_btc_dominance (received_at, raw_payload) VALUES (NOW(), $1)`,
      [JSON.stringify(resp.data)]
    );
    console.log('[CoinStats] BTC Dominance salvo!');
  } catch (e) {
    console.error('Erro salvando BTC Dominance:', e.message);
  }
}
