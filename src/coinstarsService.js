import axios from 'axios';
import { Pool } from 'pg';

const COINSTATS_API_KEY = process.env.COINSTATS_API_KEY;
const BASE_URL = "https://openapiv1.coinstats.app/insights";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Fear & Greed
export async function getFearGreedIndexAndSave() {
  try {
    const res = await axios.get(`${BASE_URL}/fear-and-greed`, {
      headers: { 'X-API-KEY': COINSTATS_API_KEY }
    });
    // Salva na tabela coinstats_fear_greed (received_at, raw_payload)
    await pool.query(
      'INSERT INTO coinstats_fear_greed (received_at, raw_payload) VALUES (NOW(), $1)',
      [JSON.stringify(res.data)]
    );
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar Fear & Greed:", err.message);
    return null;
  }
}

// BTC Dominance
export async function getBTCDominanceAndSave() {
  try {
    const res = await axios.get(`${BASE_URL}/btc-dominance`, {
      headers: { 'X-API-KEY': COINSTATS_API_KEY }
    });
    // Salva na tabela coinstats_btc_dominance (received_at, raw_payload)
    await pool.query(
      'INSERT INTO coinstats_btc_dominance (received_at, raw_payload) VALUES (NOW(), $1)',
      [JSON.stringify(res.data)]
    );
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar BTC Dominance:", err.message);
    return null;
  }
}
