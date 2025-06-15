 // src/utils/scheduler.js
 import cron from 'node-cron';
 import {
   fetchMetrics,
   saveMarketMetrics,
   fetchFearGreed,
   saveFearGreed,
+  fetchDominance,
+  saveDominance
 } from '../services/coinstatsService.js';
-import { query } from '../services/databaseService.js';
+import { query } from '../services/databaseService.js'; // agora existe

 export function setupScheduler() {
   // coleta CoinStats a cada 2h
   cron.schedule('0 */2 * * *', async () => {
     try {
       const apiKey = process.env.COINSTATS_API_KEY;

       const markets = await fetchMetrics(apiKey);
       await saveMarketMetrics(markets);

       const fg = await fetchFearGreed(apiKey);
       await saveFearGreed(fg);

       const dom = await fetchDominance(apiKey);
       await saveDominance(dom);

       console.log('✅ Dados CoinStats salvos');
     } catch (err) {
       console.error('🚨 Erro no scheduler CoinStats:', err);
     }
   });

   // limpeza diária de signals >72h
   cron.schedule('0 1 * * *', async () => {
     try {
-      await query(`DELETE FROM signals WHERE captured_at < NOW() - INTERVAL '72 hours'`);
+      await query(`DELETE FROM signals WHERE captured_at < NOW() - INTERVAL '72 hours'`);
       console.log('🗑️ Signals antigas limpas');
     } catch (err) {
       console.error('🚨 Erro ao limpar sinais antigos:', err);
     }
   });
 }
