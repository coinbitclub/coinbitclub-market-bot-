/* =============================================
   src/signals.js
   ============================================= */
export function parseSignal(payload) {
  return {
    symbol: payload.ticker,
    diffBtcEma7: Number(payload.diff_btc_ema7),
    cruzouAcimaEma9: payload.cruzou_acima_ema9===1,
    cruzouAbaixoEma9: payload.cruzou_abaixo_ema9===1,
    leverage: Number(payload.leverage||6)
  };
}
