import express from 'express';
import webhookRoutes from './routes/webhook.js';
import './maintenance/cleanupAndConsolidate.js';
import './cron.js'


const app = express();

// Middleware para receber JSON
app.use(express.json());

// Rotas
app.use('/webhook', webhookRoutes);

// Porta dinâmica para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
