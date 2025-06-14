import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { setupScheduler } from './utils/scheduler.js';
import signalsRouter from './routes/signals.js'; // <-- Correto

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
app.use('/webhook', signalsRouter); // <-- Correto

// Error Handler global
app.use((err, _req, res, _next) => {
  logger.error(err.stack || err);
  res.status(500).json({ error: 'Internal server error' });
});

// Inicialização
const PORT = process.env.PORT || 3000;

console.log('===== BOOT COINBITCLUB MARKET-BOT ====='); // LOG de boot

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log('Servidor inicializado e escutando na porta', PORT); // LOG de inicialização
  if (setupScheduler) setupScheduler();
});

export default app;
