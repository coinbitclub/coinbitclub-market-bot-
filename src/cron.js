import cron from 'node-cron';
import { cleanupOldRecords, consolidateDailyData } from './services/cleanupService.js';

// Limpa a cada hora
cron.schedule('0 * * * *', async () => {
  try {
    await cleanupOldRecords();
    console.log('Limpeza de dados antigos concluída.');
  } catch (err) {
    console.error('Erro na limpeza:', err);
  }
});

// Consolida dados às 00h (meia-noite)
cron.schedule('0 0 * * *', async () => {
  try {
    await consolidateDailyData();
    console.log('Consolidação diária concluída.');
  } catch (err) {
    console.error('Erro na consolidação:', err);
  }
});
