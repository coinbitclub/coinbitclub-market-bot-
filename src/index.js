import express from 'express';
import webhookRouter from './routes/webhook.js';

const app = express();
app.use(express.json());

// Registra as rotas do webhook
app.use('/webhook', webhookRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
