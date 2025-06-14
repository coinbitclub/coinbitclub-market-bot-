import { pool } from './databaseService.js';

export async function saveSignal(signal) {
  const query = `
    INSERT INTO signals (
      ticker, close, ema9_30, rsi_4h, rsi_15, momentum_15,
      atr_30, atr_pct_30, vol_30, vol_ma_30, diff_btc_ema7,
      leverage, signal_time
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
  `;
  const values = [
    signal.ticker, signal.close, signal.ema9_30, signal.rsi_4h, signal.rsi_15,
    signal.momentum_15, signal.atr_30, signal.atr_pct_30,
    signal.vol_30, signal.vol_ma_30, signal.diff_btc_ema7,
    signal.leverage, signal.signal_time
  ];
  try {
    await pool.query(query, values);
    console.log('Sinal salvo no banco:', signal.ticker, signal.signal_time);
  } catch (err) {
    console.error('Erro ao salvar sinal:', err);
    throw err;
  }
}
