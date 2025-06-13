export function parseSignal(body) {
return {
ticker: body.ticker,
time: new Date(body.time),
diffBtcEma7: Number(body.diff_btc_ema7),
cruzouAcimaEma9: Boolean(body.cruzou_acima_ema9),
cruzouAbaixoEma9: Boolean(body.cruzou_abaixo_ema9),
leverage: Number(body.leverage || 6)
};
}
