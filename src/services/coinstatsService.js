import axios from 'axios';

const BASE = 'https://openapiv1.coinstats.app';

export async function fetchFearGreed(apiKey) {
  const { data } = await axios.get(
    `${BASE}/insights/fear-and-greed`,
    { headers: { accept: 'application/json', 'X-API-KEY': apiKey } }
  );
  return data;
}

export async function fetchMetrics(apiKey) {
  const { data } = await axios.get(
    `${BASE}/markets`,
    { headers: { accept: 'application/json', 'X-API-KEY': apiKey } }
  );
  return data;
}

export async function fetchDominance(apiKey) {
  const { data } = await axios.get(
    `${BASE}/insights/btc-dominance?type=24h`,
    { headers: { accept: 'application/json', 'X-API-KEY': apiKey } }
  );
  return data;
}
