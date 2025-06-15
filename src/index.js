// src/index.js
import express from 'express';
import dotenv from 'dotenv';

import webhookRouter from './routes/webhook.js';
import apiRouter     from './routes/api.js';
import { setupScheduler } from './utils/scheduler.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '100kb' }));

// Health‐checks
app.get('/',      (_req, res) => res.send('OK'));
app.get('/health',(_req, res) => res.send('OK'));

// — Authentication ONLY on /webhook ——
app.use('/webhook', (req, res, next) => {
  const token = req.query.token || req.headers['x-access-token'];
  if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
  next();
});

// mount routers
app.use('/webhook', webhookRouter);
app.use('/api',     apiRouter);

// start scheduler (vai puxar Fear-Greed e Markets a cada 2h e salvar no banco)
setupScheduler();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor inicializado na porta ${PORT}`);
});
