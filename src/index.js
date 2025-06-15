import express from 'express';
import dotenv from 'dotenv';
import webhookRouter from './routes/webhook.js';
import apiRouter     from './routes/api.js';
import { setupScheduler } from './utils/scheduler.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '100kb' }));

// Health
app.get('/',      (_req, res) => res.send('OK'));
app.get('/health',(_req, res) => res.send('OK'));

// Proteger só o webhook
app.use('/webhook', (req,res,next) => {
  const token = req.query.token || req.headers['x-access-token'];
  if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
    return res.status(401).json({ status:'error',message:'Unauthorized' });
  }
  next();
});

app.use('/webhook', webhookRouter);
app.use('/api',     apiRouter);

// Disparar cron jobs
setupScheduler();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor na porta', PORT));
