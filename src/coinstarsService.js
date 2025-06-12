// market-bot/src/coinstarsService.js
import axios from 'axios';

export async function getFearGreedIndexAndSave(pool) {
  const rawKey = process.env.COINSTATS_API_KEY ?? '';
  const apiKey = rawKey.replace(/(^['"]|['"]$)/g, '').trim();
  if (!apiKey) throw new Error('COINSTATS_API_KEY não definido ou inválido');

  const resp = await axios.get(
    'https://openapiv1.coinstats.app/insights/fear-and-greed',
    { headers: { 'X-API-KEY': apiKey, accept: 'application/json' } }
  );

  await pool.query(
    `INSERT INTO coinstats_fear_greed (received_at, raw_payload) VALUES (NOW(), $1)`,
    [JSON.stringify(resp.data)]
  );
  console.log('[CoinStats] Fear & Greed salvo!');
  return resp.data;
}

export async function getBTCDominanceAndSave(pool) {
  const rawKey = process.env.COINSTATS_API_KEY ?? '';
  const apiKey = rawKey.replace(/(^['"]|['"]$)/g, '').trim();
  if (!apiKey) throw new Error('COINSTATS_API_KEY não definido ou inválido');

  const resp = await axios.get(
    'https://openapiv1.coinstats.app/insights/btc-dominance',
    { headers: { 'X-API-KEY': apiKey, accept: 'application/json' } }
  );

  await pool.query(
    `INSERT INTO coinstats_btc_dominance (received_at, raw_payload) VALUES (NOW(), $1)`,
    [JSON.stringify(resp.data)]
  );
  console.log('[CoinStats] BTC Dominance salvo!');
  return resp.data;
}
