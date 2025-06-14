try {
  console.log('Iniciando o app...');
  import('dotenv').then(dotenv => dotenv.config());
  import('express').then(({ default: express }) => {
    import('./webhooks.js').then(({ default: webhookRoutes }) => {
      import('./utils/scheduler.js').then(({ setupScheduler }) => {
        import('./utils/logger.js').then(({ logger }) => {
          const app = express();
          app.use(express.json({ limit: '100kb' }));

          app.use('/webhook', (req, res, next) => {
            if (req.query.token !== process.env.WEBHOOK_TOKEN)
              return res.status(401).send('Unauthorized');
            next();
          });

          app.get('/', (_req, res) => res.send('OK'));
          app.get('/health', (_req, res) => res.sendStatus(200));
          app.use('/webhook', webhookRoutes);

          app.use((err, _req, res, _next) => {
            logger.error(err.stack || err);
            res.status(500).json({ error: 'Internal server error' });
          });

          const PORT = process.env.PORT || 3000;
          app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            setupScheduler();
          });
        }).catch(err => {
          console.error('Erro ao importar logger:', err);
        });
      }).catch(err => {
        console.error('Erro ao importar scheduler:', err);
      });
    }).catch(err => {
      console.error('Erro ao importar webhooks:', err);
    });
  }).catch(err => {
    console.error('Erro ao importar express:', err);
  });
} catch (err) {
  console.error('Erro de inicialização:', err);
}
