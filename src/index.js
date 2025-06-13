// src/index.js

import express from 'express';
import dotenv from 'dotenv';
import routes from './webhooks.js';
import { setupScheduler } from './utils/scheduler.js';
import { logger } from './logger.js';

dotenv.config();

const app = express();

// suporta payloads de até 100 kb
app.use(express.json({ limit: '100kb' }));

// monta todas as rotas: 
//  • POST /webhook/... 
//  • GET  /api/...
app.use(routes);

// healthcheck
app.get('/health', (req, res) => res.sendStatus(200));

// middleware de erro
app.use((err, req, res, next) => {
  logger.error(err.stack || err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  setupScheduler();
});

// shutdown gracioso
process.on('SIGTERM', () => server.close(() => logger.info('Server closed on SIGTERM')));
process.on('SIGINT',  () => server.close(() => logger.info('Server closed on SIGINT')));
