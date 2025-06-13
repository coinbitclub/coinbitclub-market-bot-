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
logger.info(Server running on port ${PORT});
setupScheduler();
});

// Graceful shutdown
process.on('SIGTERM', () => server.close(() => logger.info('Server closed on SIGTERM')));
process.on('SIGINT', () => server.close(() => logger.info('Server closed on SIGINT')));

============================

CREATE TABLE users (
id SERIAL PRIMARY KEY,
email TEXT UNIQUE NOT NULL,
softr_id TEXT UNIQUE NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscriptions (
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
plan TEXT NOT NULL,
active BOOLEAN DEFAULT TRUE,
started_at TIMESTAMP DEFAULT NOW(),
expires_at TIMESTAMP
);

CREATE TABLE orders (
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
exchange TEXT NOT NULL,
symbol TEXT NOT NULL,
side TEXT NOT NULL,
qty NUMERIC NOT NULL,
entry_price NUMERIC NOT NULL,
leverage INT NOT NULL,
tp_percent NUMERIC NOT NULL,
sl_percent NUMERIC NOT NULL,
status TEXT NOT NULL,
profit_loss NUMERIC,
created_at TIMESTAMP DEFAULT NOW()
);
