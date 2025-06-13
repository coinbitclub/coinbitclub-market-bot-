import axios from 'axios';
const BASE = 'https://api.coinstats.app/public/v1';
export async function getFearGreedAndDominance(apiKey) {
  const { data } = await axios.get(`${BASE}/global?apikey=${apiKey}`);
  return { fearGreed: data.fearGreedIndex, dominance: data.marketCapPercentage.btc };
}
