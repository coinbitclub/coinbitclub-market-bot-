// src/webhooks.js
import express from 'express';
import { query } from './databaseService.js'; // ou ajuste o caminho do seu serviço de banco!

const router = express.Router();

router.post('/signal', async (req, res) => {
  try {
    // Esperando o alerta do TradingView em JSON já no body
    const {
      ticker,
      time,
      diff_btc_ema7,
      cruzou_acima_ema9,
      cruzou_abaixo_ema9,
      ...rest // tudo o que não está mapeado acima
    } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Monta os valores para o banco
    const insertQuery = `
      INSERT INTO signals
      (ticker, signal_time, diff_btc_ema7, cruzou_acima_ema9, cruzou_abaixo_ema9, payload)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [
      ticker,
      time ? new Date(time) : new Date(), // se não vier, usa agora
      diff_btc_ema7 ? Number(diff_btc_ema7) : null,
      cruzou_acima_ema9 === undefined ? null : !!Number(cruzou_acima_ema9),
      cruzou_abaixo_ema9 === undefined ? null : !!Number(cruzou_abaixo_ema9),
      rest ? JSON.stringify(req.body) : '{}'
    ];

    await query(insertQuery, values);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro no webhook /signal:', err);
    res.status(500).json({ error: 'Falha ao processar sinal' });
  }
});

router.post('/dominance', async (req, res) => {
  // Exemplo de handler para dominance (ajuste conforme sua tabela específica)
  res.status(200).json({ ok: true });
});

export default router;
