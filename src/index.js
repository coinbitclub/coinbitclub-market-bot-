// src/index.js
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '100kb' }));

// Health checks
app.get('/', (_req, res) => res.send('OK'));
app.get('/health', (_req, res) => res.send('OK'));

// Webhook simples, só para debug
app.post('/webhook/signal', (req, res) => {
  console.log('Webhook recebido:', req.body);
  res.status(200).json({ ok: true, recebido: req.body });
});

// Inicialização
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor inicializado na porta', PORT);
});

