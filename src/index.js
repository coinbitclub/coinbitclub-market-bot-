import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './webhooks.js';
import { setupScheduler } from './utils/scheduler.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '100kb' }));

// Health checks antes das proteções de token
app.get('/', (_req, res) => res.send('OK'));
app.get('/health', (_req, res) => res.sendStatus(200));

// Middleware de token para rotas de webhook
app.use('/webhook', (req, res, next) => {
  if (req.query.token !== process.env.WEBHOOK_TOKEN) {
    logger.warn(`Tentativa de acesso sem token válido. Token recebido: ${req.query.token}`);
    return res.status(401).send('Unauthorized');
  }
  next();
});
app.use('/webhook', webhookRoutes);

// Error Handler global
app.use((err, _req, res, _next) => {
  logger.error(err.stack || err);
  res.status(500).json({ error: 'Internal server error' });
});

// Inicialização
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  if (setupScheduler) setupScheduler();
});

export default app;
