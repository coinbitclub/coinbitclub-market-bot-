import cron from 'node-cron';
import { query } from '../databaseService.js';    // <-- caminho ajustado

export function setupScheduler() {
  // limpa sinais com mais de 72h todo dia à meia-noite
  cron.schedule('0 0 * * *', async () => {
    await query(
      `DELETE FROM signals WHERE created_at < NOW() - INTERVAL '72 hours';`
    );
    console.log('Old signals purged');
  });

  // exemplo: coleta Fear & Greed e insere na tabela fear_greed a cada hora
  cron.schedule('0 * * * *', async () => {
    const { getFearGreedAndDominance } = await import('../services/coinstatsService.js');
    const { fearGreed } = await getFearGreedAndDominance(process.env.COINSTATS_API_KEY);
    const now = new Date();
    await query(
      `INSERT INTO fear_greed(captured_at, value) VALUES($1, $2)`,
      [now, fearGreed]
    );
    console.log(`Inserted Fear & Greed=${fearGreed} at ${now.toISOString()}`);
  });

  // aqui você adiciona outras tarefas: metrics, retraining, etc.
}
