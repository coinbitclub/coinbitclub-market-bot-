import pool from '../db.js';

export async function saveSignal(data) {
    const {
        ticker = null,
        type = null,
        time = null,
        close = null,
        ema9_30 = null,
        rsi_4h = null,
        rsi_15 = null,
        momentum_15 = null,
        atr_30 = null,
        atr_pct_30 = null,
        vol_30 = null,
        vol_ma_30 = null,
        diff_btc_ema7 = null,
        cruzou_acima_ema9 = null,
        cruzou_abaixo_ema9 = null,
        user_id = null,
    } = data;

    const query = `
        INSERT INTO signals (
            ticker, type, time, close, ema9_30, rsi_4h, rsi_15, momentum_15, atr_30,
            atr_pct_30, vol_30, vol_ma_30, diff_btc_ema7, cruzou_acima_ema9, cruzou_abaixo_ema9, user_id, signal_json, received_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
        RETURNING *;
    `;

    const values = [
        ticker,
        type,
        time,
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
        cruzou_abaixo_ema9,
        user_id,
        data, // salva o objeto inteiro para auditoria/facilidade futura
    ];

    await pool.query(query, values);
}
