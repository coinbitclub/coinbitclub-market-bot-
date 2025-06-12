import axios from 'axios';

const API_BASE = 'https://api.coinstats.app/public/v1';
   
/**
 * Grava o índice Fear & Greed na tabela coinstats_fear_greed.
 */
export async function getFearGreedIndexAndSave(pool) {
  const url = `${API_BASE}/insights/fear-and-greed`;
  const { data } = await axios.get(url);
  await pool.query(
    `INSERT INTO coinstats_fear_greed (received_at, raw_payload)
     VALUES (NOW(), $1)`,
    [JSON.stringify(data)]
  );
}

/**
 * Grava a dominância BTC na tabela coinstats_btc_dominance.
 */
export async function getBTCDominanceAndSave(pool) {
  const url = `${API_BASE}/insights/btc-dominance`;
  const { data } = await axios.get(url);
  await pool.query(
    `INSERT INTO coinstats_btc_dominance (received_at, raw_payload)
     VALUES (NOW(), $1)`,
    [JSON.stringify(data)]
  );
}
