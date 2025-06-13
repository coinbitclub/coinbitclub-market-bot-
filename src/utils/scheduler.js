// src/utils/scheduler.js

import cron from 'node-cron';
// <<< CORREÇÃO AQUI: caminho para a raiz do src
import { query } from '../databaseService.js';

export function setupScheduler() {
  // 1) a cada hora, apaga sinais com mais de 72h
  cron.schedule('0 * * * *', async () => {
    await query(
      "DELETE FROM signals WHERE created_at < NOW() - INTERVAL '72 hours'"
    );
  });

  // -- você pode adicionar outras tarefas agendadas aqui --
}
