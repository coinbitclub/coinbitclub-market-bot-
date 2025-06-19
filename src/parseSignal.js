// src/parseSignal.js
/**
 * Recebe body como string (raw JSON) ou objeto e
 * retorna um objeto já “parseado” com as chaves corretas.
 */
export function parseSignal(raw) {
  // se veio como texto, transforma em objeto
  const body = typeof raw === 'string' ? JSON.parse(raw) : raw;

  return {
    ticker: String(body.ticker),
    time: new Date(body.time),
    close: parseFloat(body.close),
    ema9: parseFloat(body.ema9_30 ?? body.ema9),
    rsi4h: parseFloat(body.rsi_4h ?? body.rsi4h),
    rsi15: parseFloat(body.rsi_15 ?? body.rsi15),
    momentum15: parseFloat(body.momentum_15 ?? body.momentum15),
    atr30: parseFloat(body.atr_30 ?? body.atr30),
    atrPct30: parseFloat(body.atr_pct_30 ?? body.atrPct30),
    vol30: parseFloat(body.vol_30 ?? body.vol30),
    volMa30: parseFloat(body.vol_ma_30 ?? body.volMa30),
    diffBtcEma7: parseFloat(body.diff_btc_ema7 ?? body.diffBtcEma7),
    cruzouAcimaEma9: Boolean(body.cruzou_acima_ema9 ?? body.cruzouAcimaEma9),
    cruzouAbaixoEma9: Boolean(body.cruzou_abaixo_ema9 ?? body.cruzouAbaixoEma9),
    leverage: parseInt(body.leverage, 10),
  };
}
