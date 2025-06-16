import express from 'express';
import dotenv from 'dotenv';
import webhookRouter from './routes/webhook.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/webhook', webhookRouter);

app.get('/', (req, res) => {
  res.send('CoinBitClub Market Bot - OK');
});

export default app;
