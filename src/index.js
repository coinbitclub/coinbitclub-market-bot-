// src/index.js
import express      from 'express';
import dotenv       from 'dotenv';
import webhookRouter from './routes/webhook.js';
import apiRouter     from './routes/api.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '100kb' }));

// Health-checks
app.get('/',      (_req, res) => res.send('OK'));
app.get('/health',(_req, res) => res.send('OK'));

// ——— Autentica só o webhook ———
function requireWebhookToken(req, res, next) {
  const token = req.query.token || req.headers['x-access-token'];
  if (process.env.WEBHOOK_TOKEN && token !== process.env.WEBHOOK_TOKEN) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
  next();
}

// monta as rotas
app.use('/webhook', requireWebhookToken, webhookRouter);
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor inicializado na porta', PORT);
});
