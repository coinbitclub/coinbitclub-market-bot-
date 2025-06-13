import { query } from '../databaseService.js';

/**
 * Espera um objeto `signal` com as chaves exatamente
 * conforme o JSON enviado pelo Pine
 */
export async function saveSignal(signal) {
  const now = new Date();
  const {
    ticker,
    close,
    ema9_30,
    rsi_4h,
    rsi_15,
    momentum_15,
    atr_30,
    atr_pct_30,
    vol_30,
    vol_ma_30,
    diff_btc_ema7,
    cruzou_acima_ema9,
    cruzou_abaixo_ema9
  } = signal;

  await query(
    `INSERT INTO signals(
        captured_at,
        ticker,
        close,
        ema9_30,
        rsi_4h,
        rsi_15,
        momentum_15,
        atr_30,
        atr_pct_30,
        vol_30,
        vol_ma_30,
        diff_btc_ema7,
        cruzou_acima_ema9,
        cruzou_abaixo_ema9
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
      )`,
    [
      now,
      ticker,
      close,
      ema9_30,
      rsi_4h,
      rsi_15,
      momentum_15,
      atr_30,
      atr_pct_30,
      vol_30,
      vol_ma_30,
      diff_btc_ema7,
      cruzou_acima_ema9 ? 1 : 0,
      cruzou_abaixo_ema9 ? 1 : 0
    ]
  );
}
