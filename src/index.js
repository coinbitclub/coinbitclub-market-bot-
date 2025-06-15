// src/index.js
import express from 'express';
import webhookRouter from './routes/webhook.js';
import { logger } from './logger.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck
app.get('/health', (req, res) => res.send('OK'));

// __Aqui__ usamos somente o routes/webhook.js
app.use('/webhook', webhookRouter);

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

export default app;
