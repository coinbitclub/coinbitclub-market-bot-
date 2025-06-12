import cron from 'node-cron';
import {
  getFearAndGreedAndSave,
  getBTCDominanceAndSave
} from './services/coinstatsService.js';

// TODO: ajuste se quiser outro horário — abaixo todo começo de hora e meio-hora
cron.schedule('30 * * * *', getFearAndGreedAndSave);
cron.schedule('0  * * * *', getBTCDominanceAndSave);

console.log('✅ Cron de CoinStats agendado: FG a cada :30, BTC Dom a cada :00');
