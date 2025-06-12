import axios from 'axios';

const API_KEY = process.env.COINSTATS_API_KEY;

// Fear & Greed
export async function getFearGreedIndexAndSave(pool) {
  try {
    const url = 'https://openapiv1.coinstats.app/insights/fear-and-greed';
    const resp = await axios.get(url, {
      headers: {
        'X-API-KEY': API_KEY,
        'accept': 'application/json'
      }
    });
    await pool.query(
      `INSERT INTO coinstats_fear_greed (received_at, raw_payload) VALUES (NOW(), $1)`,
      [JSON.stringify(resp.data)]
    );
    console.log('[CoinStats] Fear & Greed salvo!');
    return resp.data;
  } catch (e) {
    console.error('Erro salvando Fear & Greed:', e.message);
    return null;
  }
}

// BTC Dominance
export async function getBTCDominanceAndSave(pool) {
  try {
    const url = 'https://openapiv1.coinstats.app/insights/btc-dominance';
    const resp = await axios.get(url, {
      headers: {
        'X-API-KEY': API_KEY,
        'accept': 'application/json'
      }
    });
    await pool.query(
      `INSERT INTO coinstats_btc_dominance (received_at, raw_payload) VALUES (NOW(), $1)`,
      [JSON.stringify(resp.data)]
    );
    console.log('[CoinStats] BTC Dominance salvo!');
    return resp.data;
  } catch (e) {
    console.error('Erro salvando BTC Dominance:', e.message);
    return null;
  }
}
