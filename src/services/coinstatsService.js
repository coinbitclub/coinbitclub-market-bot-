import axios from 'axios';
import {
  saveFearGreed,
  saveBTCDominance
} from './databaseService.js';

const FG_URL = 'https://openapiv1.coinstats.app/insights/fear-and-greed';
const DOM_URL = 'https://openapiv1.coinstats.app/insights/btc_dominance';

export async function fetchAndSaveFearGreed() {
  const { data } = await axios.get(FG_URL);
  await saveFearGreed(data);
  return data;
}

export async function fetchAndSaveBTCDominance() {
  const { data } = await axios.get(DOM_URL);
  await saveBTCDominance(data);
  return data;
}
