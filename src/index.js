import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './webhooks.js';
import apiRoutes from './webhooks.js';
import { setupScheduler } from './utils/scheduler.js';
import { logger } from './logger.js';

dotenv.config();
const app = express();

app.use(express.json({ limit: '100kb' }));
app.use('/webhook', webhookRoutes);
app.use('/api', apiRoutes);
app.get('/health', (req, res) => res.sendStatus(200));

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.stack || err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  setupScheduler();
});

// Graceful shutdown
process.on('SIGTERM', () => server.close(() => logger.info('Server closed on SIGTERM')));
process.on('SIGINT',  () => server.close(() => logger.info('Server closed on SIGINT')));
