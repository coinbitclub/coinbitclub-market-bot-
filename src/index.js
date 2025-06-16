import express from 'express';
import webhookRoutes from './routes/webhook.js';

const app = express();

app.use(express.json());

// Rotas
app.use('/webhook', webhookRoutes);

// Healthcheck raiz (opcional)
app.get('/', (req, res) => {
  res.json({ status: 'ok', msg: 'API online' });
});

// Use SEMPRE process.env.PORT para Railway!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
