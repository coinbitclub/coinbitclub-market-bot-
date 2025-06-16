import cron from 'node-cron'
import { cleanupDatabase } from './services/cleanupService.js'

// Roda todo dia à meia-noite
cron.schedule('0 0 * * *', async () => {
  await cleanupDatabase()
  console.log('Limpeza e agregação diária executadas.')
})
