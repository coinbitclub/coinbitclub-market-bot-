import dotenv from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import app from './src/index.js';
import { logger } from './src/logger.js';

dotenv.config();

const port = process.env.PORT || 3000;
const mdir = path.join(process.cwd(), 'migrations');

// 1) ESLint — nunca trava
try {
  logger.info('🔍 Running ESLint...');
  execSync('npm run lint', { stdio: 'inherit' });
} catch (e) {
  logger.warn('⚠️ ESLint issues detected, continuing...');
}

// 2) Testes — nunca trava
try {
  logger.info('🧪 Running unit tests...');
  execSync('npm test', { stdio: 'inherit' });
} catch (e) {
  logger.warn('⚠️ Unit test failures detected, continuing...');
}

// 3) Migrations — só trava se migrations der erro (isso é crítico)
try {
  logger.info('🔄 Executing migrations...');
  execSync(`psql ${process.env.DATABASE_URL} -f ${mdir}/001_initial_schema.sql`, { stdio: 'inherit' });
  execSync(`psql ${process.env.DATABASE_URL} -f ${mdir}/002_add_indexes.sql`,    { stdio: 'inherit' });
  execSync(`psql ${process.env.DATABASE_URL} -f ${mdir}/003_fix_signals_schema.sql`, { stdio: 'inherit' });
  logger.info('✅ Migrations completed');
} catch (err) {
  logger.error('❌ Migration error', err);
  process.exit(1);
}

// 4) Start server — só trava se não conseguir subir servidor (isso é crítico)
try {
  app.listen(port, () => logger.info(`🚀 Server running on port ${port}`));
} catch (err) {
  logger.error('❌ Server startup error', err);
  process.exit(1);
}
