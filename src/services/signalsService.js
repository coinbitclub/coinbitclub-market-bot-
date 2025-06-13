import { query } from './databaseService.js';

// Persistência de sinais (tradingview completo)
export async function saveSignal(payload) {
  const {
    ticker, time, close,
    ema9_30, rsi4h, rsi15, momentum15,
    atr30, atrPct30, vol30, volMa30,
    diffBtcEma7, cruzouAcimaEma9, cruzouAbaixoEma9
  } = payload;

  const sql = `
    INSERT INTO signals(
      ticker, captured_at, close_price,
      ema9_30, rsi_4h, rsi_15, momentum_15,
      atr_30, atr_pct_30, vol_30, vol_ma_30,
      diff_btc_ema7, cruzou_acima_ema9, cruzou_abaixo_ema9
    ) VALUES(
      $1, $2, $3,
      $4, $5, $6, $7,
      $8, $9, $10, $11,
      $12, $13, $14
    );
  `;
  await query(sql, [
    ticker, time, close,
    ema9_30, rsi4h, rsi15, momentum15,
    atr30, atrPct30, vol30, volMa30,
    diffBtcEma7, cruzouAcimaEma9, cruzouAbaixoEma9
  ]);
}
