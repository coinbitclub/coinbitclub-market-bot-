import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './webhooks.js';
import { setupScheduler } from './utils/scheduler.js';
import { logger } from './logger.js';

dotenv.config();
const app = express();
app.use(express.json({ limit: '100kb' }));

app.get('/', (_req, res) => res.send('OK'));
app.use('/webhook', webhookRoutes);
app.get('/health', (_req, res) => res.sendStatus(200));

// error handler
app.use((err, _req, res, _next) => {
  logger.error(err.stack || err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  setupScheduler();
});
