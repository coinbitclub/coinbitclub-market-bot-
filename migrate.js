// migrate.js
import { execSync } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

// carrega .env
dotenv.config();

const migrationsDir = path.join(process.cwd(), 'migrations');

try {
  console.log('🔄 Executando migrations...');
  execSync(`psql ${process.env.DATABASE_URL} -f ${migrationsDir}/001_initial_schema.sql`, { stdio: 'inherit' });
  execSync(`psql ${process.env.DATABASE_URL} -f ${migrationsDir}/002_add_indexes.sql`,    { stdio: 'inherit' });
  console.log('✅ Migrations concluídas.');
} catch (err) {
  console.error('❌ Falha ao rodar migrations:', err);
  process.exit(1);
}
