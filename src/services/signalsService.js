import { query } from './databaseService.js';
import { logger } from '../utils/logger.js'; // Use se quiser logs padronizados

export async function saveSignal(signal) {
  const sql = `
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
    await query(sql, values);
    logger.info(`[saveSignal] Sinal salvo no banco: ${signal.ticker} @ ${signal.signal_time}`);
  } catch (err) {
    logger.error(`[saveSignal] Erro ao salvar sinal: ${err.message}`);
    throw err;
  }
}
