// src/services/coinstatsService.js
import axios from 'axios';

const COINSTATS_INSIGHTS = 'https://openapiv1.coinstats.app/insights';
const API_KEY = process.env.COINSTATS_API_KEY.trim();

export async function fetchFearGreed() {
  const url = `${COINSTATS_INSIGHTS}/fear-and-greed`;
  const resp = await axios.get(url, {
    headers: { 'X-API-KEY': API_KEY }
  });
  return resp.data;
}

export async function fetchBTCDominance() {
  const url = `${COINSTATS_INSIGHTS}/btc-dominance`;
  const resp = await axios.get(url, {
    headers: { 'X-API-KEY': API_KEY }
  });
  return resp.data;
}
