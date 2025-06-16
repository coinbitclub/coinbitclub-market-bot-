// src/parseDominance.js
export function parseDominance(raw) {
  return {
    time:    raw.time,
    btc_d:   raw.btc_d   ?? null,
    eth_d:   raw.eth_d   ?? null,
    usdt_d:  raw.usdt_d  ?? null,
    usdc_d:  raw.usdc_d  ?? null,
    others:  raw.others  ?? null,
    total:   raw.total   ?? null,
    comment: raw.comment ?? null
  };
}