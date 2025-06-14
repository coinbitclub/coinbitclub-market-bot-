export function parseSignal(data) {
  return {
    ticker: data.ticker,
    close: Number(data.close),
    ema9_30: Number(data.ema9_30),
    rsi_4h: Number(data.rsi_4h),
    rsi_15: Number(data.rsi_15),
    momentum_15: Number(data.momentum_15),
    atr_30: Number(data.atr_30),
    atr_pct_30: Number(data.atr_pct_30),
    vol_30: Number(data.vol_30),
    vol_ma_30: Number(data.vol_ma_30),
    diff_btc_ema7: Number(data.diff_btc_ema7),
    leverage: Number(data.leverage),
    signal_time: data.signal_time
  };
}
