cat > src/index.js << 'EOF'
import express from 'express';
import dotenv  from 'dotenv';
import webhookRoutes from './routes/webhook.js';
import { setupScheduler } from './cronJobs.js';  // ou './utils/scheduler.js' conforme seu clone
import { logger } from './utils/logger.js';

dotenv.config();
const app = express();
app.use(express.json({ limit: '100kb' }));

// auth token
app.use('/webhook', (req, res, next) => {
  if (req.query.token !== process.env.WEBHOOK_TOKEN)
    return res.status(401).send('Unauthorized');
  next();
});

// health
app.get('/', (_req, res) => res.send('OK'));
app.get('/health', (_req, res) => res.sendStatus(200));

// webhooks
app.use('/webhook', webhookRoutes);

// errors
app.use((err, _req, res, _next) => {
  logger.error(err.stack || err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  setupScheduler();
});
EOF
