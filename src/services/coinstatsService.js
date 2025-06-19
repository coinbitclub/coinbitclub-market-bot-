// src/services/coinstatsService.js
import axios from 'axios';
import logger from '../utils/logger.js';
import { query } from './databaseService.js';

const BASE = 'https://api.coinstats.app/public/v1';

// Dominância
export async function fetchAndSaveDominance() {
  const res = await axios.get(`${BASE}/global-stats`, {
    headers: { 'X-API-KEY': process.env.COINSTATS_API_KEY }
  });
  const { btcDominance } = res.data;
  logger.info('Fetched dominance', { btcDominance });
  await query(
    'INSERT INTO dominance_daily(time, dominance) VALUES($1, $2)',
    [new Date().toISOString(), btcDominance]
  );
}

// Fear & Greed
export async function fetchAndSaveFearGreed() {
  const res = await axios.get(`${BASE}/fear-and-greed`, {
    headers: { 'X-API-KEY': process.env.COINSTATS_API_KEY }
  });
  const { index } = res.data;
  logger.info('Fetched Fear & Greed', { index });
  await query(
    'INSERT INTO fear_greed(time, index) VALUES($1, $2)',
    [new Date().toISOString(), index]
  );
}

// Métricas de mercado
export async function fetchAndSaveMarkets() {
  const res = await axios.get(`${BASE}/coins`, {
    headers: { 'X-API-KEY': process.env.COINSTATS_API_KEY }
  });
  logger.info('Fetched markets', { count: res.data.coins.length });
  // implementar gravação em coinstats_metrics conforme schema
}
