import dotenv from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import app from './src/index.js';
import { logger } from './src/logger.js';

dotenv.config();

const port = process.env.PORT || 3000;
const mdir = path.join(process.cwd(), 'migrations');

// 1) ESLint — nunca trava o fluxo
try {
  logger.info('🔍 Running ESLint...');
  execSync('npm run lint', { stdio: 'inherit' });
} catch (e) {
  logger.warn('⚠️ ESLint issues detected, continuing...');
}

// 2) Testes — nunca trava o fluxo
try {
  logger.info('🧪 Running unit tests...');
  execSync('npm test', { stdio: 'inherit' });
} catch (e) {
  logger.warn('⚠️ Unit test failures detected, continuing...');
}

// 4) Start server — só trava se não conseguir subir servidor
try {
  app.listen(port, () => logger.info(`🚀 Server running on port ${port}`));
} catch (err) {
  logger.error('❌ Server startup error', err);
  process.exit(1);
}
