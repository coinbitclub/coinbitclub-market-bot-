import express from 'express';
import dotenv from 'dotenv';
import webhookRouter from './routes/webhook.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '100kb' }));

// Health checks
app.get('/', (_req, res) => res.send('OK'));
app.get('/health', (_req, res) => res.send('OK'));

// Middleware de token nas rotas /webhook e /api
app.use(['/webhook', '/api'], (req, res, next) => {
  if (req.query.token !== process.env.WEBHOOK_TOKEN) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
  next();
});

// Rotas
app.use('/webhook', webhookRouter);
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor inicializado na porta', PORT);
});


