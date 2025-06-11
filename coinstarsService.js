import axios from 'axios';

const COINSTATS_API_KEY = process.env.COINSTATS_API_KEY;
const BASE_URL = "https://openapiv1.coinstats.app/insights";

export async function getFearGreedIndex() {
  try {
    const res = await axios.get(`${BASE_URL}/fear-and-greed`, {
      headers: { 'X-API-KEY': COINSTATS_API_KEY }
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar Fear & Greed:", err.message);
    return null;
  }
}

export async function getBTCDominance() {
  try {
    const res = await axios.get(`${BASE_URL}/btc-dominance`, {
      headers: { 'X-API-KEY': COINSTATS_API_KEY }
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar BTC Dominance:", err.message);
    return null;
  }
}
