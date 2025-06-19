// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import webhookRouter from './routes/webhook.js';   // importa o único router
import { setupScheduler } from './services/scheduler.js';

dotenv.config();

// Validação das ENV VARs
const requiredEnvs = [
  'DATABASE_URL',
  'COINSTATS_API_KEY',
  'WEBHOOK_TOKEN',
  'DATABASE_SSL'
];
let missing = false;
requiredEnvs.forEach(key => {
  if (!process.env[key]) {
    logger.error(`❌ Missing environment variable: ${key}`);
    missing = true;
  } else {
    logger.info(`✅ ${key} loaded`);
  }
});
if (missing) process.exit(1);

const app = express();
// usamos text para pegar o JSON bruto e deixar o parser cuidar dele
app.use(express.text({ type: 'application/json', limit: '100kb' }));

// Autenticação por token em todas as rotas /webhook/*
app.use('/webhook', (req, res, next) => {
  if (req.query.token !== process.env.WEBHOOK_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Health-check
app.get('/', (_req, res) => res.send('OK'));
app.get('/health', (_req, res) => res.sendStatus(200));

// Monta o router único em /webhook
app.use('/webhook', webhookRouter);

// Middleware de erro global
app.use((err, _req, res, _next) => {
  logger.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  setupScheduler();
});
