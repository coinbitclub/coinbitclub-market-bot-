import express from 'express';
import webhookRoutes from './routes/webhook.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para receber JSON!
app.use(express.json());

// Todas as rotas de webhook
app.use('/webhook', webhookRoutes);

// Rota healthcheck (opcional)
app.get('/', (req, res) => {
  res.send('Server OK');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
