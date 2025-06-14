import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { setupScheduler } from './utils/scheduler.js';
import signalsRouter from './routes/signals.js';

console.log('===== INICIO INDEX.JS COINBITCLUB MARKET-BOT ====='); // LOG de boot imediato

dotenv.config();

const app = express();
app.use(express.json({ limit: '100kb' }));

// Health checks antes das proteções de token
app.get('/', (_req, res) => {
  console.log('[GET /] Health root ok');
  res.send('OK');
});
app.get('/health', (_req, res) => {
  console.log('[GET /health] Healthcheck OK');
  res.sendStatus(200);
});

// Middleware de token para rotas de webhook
app.use('/webhook', (req, res, next) => {
  if (req.query.token !== process.env.WEBHOOK_TOKEN) {
    logger.warn(`Tentativa de acesso sem token válido. Token recebido: ${req.query.token}`);
    console.log('[WEBHOOK] Token inválido:', req.query.token);
    return res.status(401).send('Unauthorized');
  }
  next();
});
app.use('/webhook', signalsRouter);

// Error Handler global
app.use((err, _req, res, _next) => {
  logger.error(err.stack || err);
  console.log('ERRO GLOBAL:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

console.log('===== PRESTES A INICIAR EXPRESS PORTA', PORT, '=====');

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log('===== EXPRESS INICIALIZADO NA PORTA', PORT, '=====');
  if (setupScheduler) setupScheduler();
});
