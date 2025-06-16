import express from 'express';
import webhookRoutes from './routes/webhook.js';

const app = express();

// Fundamental: habilita JSON no body
app.use(express.json());

// Log de debug de todas as requisições recebidas
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/webhook', webhookRoutes);

// Resposta para rota raiz, útil para healthcheck
app.get('/', (req, res) => res.send('Market-bot API online'));

// Sobe servidor na porta correta (Railway usa process.env.PORT!)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Market-bot running on port ${PORT}`);
});
