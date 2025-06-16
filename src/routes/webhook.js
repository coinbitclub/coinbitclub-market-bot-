import express from 'express';
const router = express.Router();

// Modelo seguro para GET (healthcheck/teste)
router.get('/signal', (req, res) => {
  res.json({ status: 'ok', message: 'GET /webhook/signal está ativo' });
});

// Modelo robusto para POST
router.post('/signal', async (req, res) => {
  try {
    // Log para debug
    console.log('Payload recebido:', req.body);

    // Exemplo de extração dos dados esperados
    const {
      ticker, time, close, ema9_30, rsi_4h, rsi_15, momentum_15,
      atr_30, atr_pct_30, vol_30, vol_ma_30
    } = req.body;

    // Validação rápida dos campos obrigatórios
    if (!ticker || !time) {
      return res.status(400).json({ error: 'ticker e time são obrigatórios' });
    }

    // Exemplo: converte time se vier em string para ISO/Date (opcional)
    let timeObj = time;
    if (typeof time === 'string' && time.length > 10) {
      timeObj = new Date(time);
    }

    // Aqui você pode salvar no banco, por exemplo:
    // await saveSignal({ ... });

    // Retorno de sucesso
    return res.status(200).json({ status: 'ok', received: req.body });

  } catch (error) {
    console.error('Erro em POST /webhook/signal:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
