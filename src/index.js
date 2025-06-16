import express from 'express';
import webhookRoutes from './routes/webhook.js';

const app = express();
app.use(express.json());
app.use('/webhook', webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
