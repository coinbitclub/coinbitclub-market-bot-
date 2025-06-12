import 'dotenv/config';
import express from 'express';
import './coinstatsCron.js';               // dispara o cron automaticamente
import { save as saveSignal } from './services/databaseService.js';

const app = express();
app.use(express.json());

// endpoint que o TradingView aponta
app.post('/webhook/signal', async (req, res) => {
  try {
    await saveSignal('dominance_signals', JSON.stringify(req.body));
    console.log('Sinal recebido:', req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error('Erro no webhook:', err);
    res.sendStatus(500);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`🚀 market-bot listening on port ${port}`));
