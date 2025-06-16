// src/parseSignal.js
export function parseSignal(raw) {
  return {
    ticker:      raw.ticker,
    time:        raw.time,
    close:       raw.close,
    ema9_30:     raw.ema9_30   ?? null,
    rsi_4h:      raw.rsi_4h    ?? null,
    rsi_15:      raw.rsi_15    ?? null,
    momentum_15: raw.momentum_15?? null,
    atr_30:      raw.atr_30    ?? null,
    atr_pct_30:  raw.atr_pct_30?? null,
    vol_30:      raw.vol_30    ?? null,
    vol_ma_30:   raw.vol_ma_30 ?? null
  };
}