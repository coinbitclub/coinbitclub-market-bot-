import axios from 'axios';
import { Pool } from 'pg';

const COINSTATS_API_KEY = process.env.COINSTATS_API_KEY;
const BASE_URL = "https://openapiv1.coinstats.app/insights";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getFearGreedIndexAndSave() {
  try {
    const res = await axios.get(`${BASE_URL}/fear-and-greed`, {
      headers: { 'X-API-KEY': COINSTATS_API_KEY }
    });
    // Salvar no banco
    await pool.query(
      'INSERT INTO fear_greed_signals (data) VALUES ($1)',
      [res.data]
    );
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar Fear & Greed:", err.message);
    return null;
  }
}

export async function getBTCDominanceAndSave() {
  try {
    const res = await axios.get(`${BASE_URL}/btc-dominance`, {
      headers: { 'X-API-KEY': COINSTATS_API_KEY }
    });
    // Salvar no banco
    await pool.query(
      'INSERT INTO btc_dominance_signals (data) VALUES ($1)',
      [res.data]
    );
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar BTC Dominance:", err.message);
    return null;
  }
}
