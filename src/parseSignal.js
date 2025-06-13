export function parseSignal(payload) {
  // O Pine envia todos como string! Parse sempre.
  return {
    ticker:              payload.ticker,
    captured_at:         payload.time ? new Date(payload.time) : new Date(),
    close:               parseFloat(payload.close),
    ema9_30:             parseFloat(payload.ema9_30),
    rsi_4h:              parseFloat(payload.rsi_4h),
    rsi_15:              parseFloat(payload.rsi_15),
    momentum_15:         parseFloat(payload.momentum_15),
    atr_30:              parseFloat(payload.atr_30),
    atr_pct_30:          parseFloat(payload.atr_pct_30),
    vol_30:              parseFloat(payload.vol_30),
    vol_ma_30:           parseFloat(payload.vol_ma_30),
    diff_btc_ema7:       parseFloat(payload.diff_btc_ema7),
    cruzou_acima_ema9:   payload.cruzou_acima_ema9 === "1" || payload.cruzou_acima_ema9 === 1 || payload.cruzou_acima_ema9 === true,
    cruzou_abaixo_ema9:  payload.cruzou_abaixo_ema9 === "1" || payload.cruzou_abaixo_ema9 === 1 || payload.cruzou_abaixo_ema9 === true,
    leverage:            payload.leverage ? parseInt(payload.leverage) : 6
  };
}
