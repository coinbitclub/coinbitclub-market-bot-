import axios from 'axios';

const BASE_URL = 'https://openapiv1.coinstats.app';

export async function fetchBTCdominance() {
  const { data } = await axios.get(`${BASE_URL}/insights/btc-dominance`, {
    headers: { 'X-API-KEY': process.env.COINSTATS_API_KEY }
  });
  return data;
}

export async function fetchFearGreed() {
  const { data } = await axios.get(`${BASE_URL}/insights/fear-and-greed`, {
    headers: { 'X-API-KEY': process.env.COINSTATS_API_KEY }
  });
  return data;
}

export async function fetchMarkets() {
  const { data } = await axios.get(`${BASE_URL}/markets`, {
    headers: { 'X-API-KEY': process.env.COINSTATS_API_KEY }
  });
  return data;
}
