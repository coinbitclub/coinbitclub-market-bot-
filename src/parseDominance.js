export function parseDominance(payload) {
  return {
    ticker:        payload.ticker,
    captured_at:   payload.time ? new Date(payload.time) : new Date(),
    dominance_pct: parseFloat(payload.btc_dominance ?? payload.dominance),
    ema7:          parseFloat(payload.ema_7 ?? payload.ema7),
    diff_pct:      parseFloat(payload.diff_pct),
    signal:        payload.sinal ?? payload.signal ?? null
  };
}
