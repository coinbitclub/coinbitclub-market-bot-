import axios from 'axios';
import { saveDominance } from './dominanceService.js';
import { saveFearGreed } from './fearGreedService.js';
import { saveMarkets } from './marketsService.js';

const BASE_URL = 'https://openapiv1.coinstats.app';

export async function fetchAndSaveDominance() {
  const { data } = await axios.get(`${BASE_URL}/insights/btc-dominance`);
  await saveDominance({
    btc_dominance: data.btcDominance,
    date: new Date(data.timestamp * 1000).toISOString()
  });
}

export async function fetchAndSaveFearGreed() {
  const { data } = await axios.get(`${BASE_URL}/insights/fear-and-greed`);
  await saveFearGreed({
    value: data.value,
    classification: data.value_classification,
    date: new Date(data.timestamp * 1000).toISOString()
  });
}

export async function fetchAndSaveMarkets() {
  const { data } = await axios.get(`${BASE_URL}/markets`);
  await saveMarkets(data);
}
