import express from 'express';
import webhookRoutes from './routes/webhook.js';
import './services/cleanupService.js';
import './cron.js';
import { cleanupDatabase } from './services/cleanupService.js'; // ok para named export!


const app = express();

// Middleware para receber JSON
app.use(express.json());

// Rotas
app.use('/webhook', webhookRoutes);

// === EXTRA: ROTA DE DEBUG MANUAL ===
// Acesse /debug/cleanup para forçar a limpeza no browser/postman.
app.get('/debug/cleanup', async (req, res) => {
  try {
    await cleanupDatabase();
    res.send('Limpeza e consolidação forçadas com sucesso!');
  } catch (e) {
    res.status(500).send('Erro na limpeza: ' + e.message);
  }
});

// Porta dinâmica para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
