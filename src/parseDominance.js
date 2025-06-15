// src/parseDominance.js

/**
 * Recebe raw (body ou query) e devolve
 * o formato que o dominanceService espera.
 */
export function parseDominance(raw) {
  return {
    timestamp: raw.timestamp ?? raw.time,
    btc_dom:   raw.btc_dom   ?? raw.btcDominance ?? null,
    eth_dom:   raw.eth_dom   ?? raw.ethDominance ?? null
  };
}
