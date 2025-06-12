// market-bot/src/coinstarsService.js
import axios from 'axios';

/**
 * Lê, limpa e valida COINSTATS_API_KEY,
 * faz requisição e grava no Postgres.
 */
function getApiKey() {
  const rawKey = process.env.COINSTATS_API_KEY ?? '';
  const key = rawKey.replace(/(^['"]|['"]$)/g, '').trim();
  if (!key) throw new Error('COINSTATS_API_KEY não definido ou inválido');
  return key;
}

export async function getFearGreedIndexAndSave(pool) {
  const apiKey = getApiKey();
  const { data } = await axios.get(
    'https://openapiv1.coinstats.app/insights/fear-and-greed',
    { headers: { 'X-API-KEY': apiKey, Accept: 'application/json' } }
  );
  await pool.query(
    `INSERT INTO coinstats_fear_greed (received_at, raw_payload) VALUES (NOW(), $1)`,
    [JSON.stringify(data)]
  );
  console.log('[CoinStats] Fear & Greed salvo!');
  return data;
}

export async function getBTCDominanceAndSave(pool) {
  const apiKey = getApiKey();
  const { data } = await axios.get(
    'https://openapiv1.coinstats.app/insights/btc-dominance',
    { headers: { 'X-API-KEY': apiKey, Accept: 'application/json' } }
  );
  await pool.query(
    `INSERT INTO coinstats_btc_dominance (received_at, raw_payload) VALUES (NOW(), $1)`,
    [JSON.stringify(data)]
  );
  console.log('[CoinStats] BTC Dominance salvo!');
  return data;
}
