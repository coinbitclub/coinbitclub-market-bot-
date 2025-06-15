import dotenv from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import app from './src/index.js';
import { logger } from './src/logger.js';

dotenv.config();
(async function run() {
  try {
    const port = process.env.PORT || 3000;
    const mdir = path.join(process.cwd(),'migrations');

    logger.info('🔍 ESLint'); execSync('npm run lint',{stdio:'inherit'});
    logger.info('🧪 Jest');   execSync('npm test',{stdio:'inherit'});

    logger.info('🔄 Migrations...');
    execSync(`psql ${process.env.DATABASE_URL} -f ${mdir}/001_initial_schema.sql`,{stdio:'inherit'});
    execSync(`psql ${process.env.DATABASE_URL} -f ${mdir}/002_add_indexes.sql`,{stdio:'inherit'});
    execSync(`psql ${process.env.DATABASE_URL} -f ${mdir}/003_fix_signals_schema.sql`,{stdio:'inherit'});
    logger.info('✅ Migrations concluídas');

    app.listen(port,()=>logger.info(`🚀 Server on ${port}`));
  } catch(err) {
    logger.error('❌ Bootstrap Error',err);
    process.exit(1);
  }
})();
