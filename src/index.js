import 'dotenv/config'
import express from 'express'
import { Pool } from 'pg'
import cron from 'node-cron'
import {
  getFearGreedIndexAndSave,
  getBTCDominanceAndSave
} from './services/coinstatsService.js'

const app = express()
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})
const SECRET = process.env.WEBHOOK_SECRET
const PORT = process.env.PORT || 3000

app.use(express.json())

// Webhook de sinais (exemplo)
app.post('/webhook/signal', async (req, res) => {
  if (req.query.token !== SECRET) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  try {
    // aqui você processaria o payload
    console.log('Recebido sinal:', req.body)
    // …gravação no banco, envio de ordens, etc.
    res.json({ status: 'ok' })
  } catch (err) {
    console.error('Erro no webhook /signal:', err)
    res.status(500).json({ error: err.message })
  }
})

// Webhook de dominance (exemplo)
app.post('/webhook/dominance', async (req, res) => {
  if (req.query.token !== SECRET) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  try {
    console.log('Recebida dominance:', req.body)
    res.json({ status: 'ok' })
  } catch (err) {
    console.error('Erro no webhook /dominance:', err)
    res.status(500).json({ error: err.message })
  }
})

// Cron job: Fear & Greed a cada hora (minuto 0)
cron.schedule('0 * * * *', async () => {
  try {
    await getFearGreedIndexAndSave(pool)
    console.log('CoinStats Fear & Greed salvo!')
  } catch (err) {
    console.error('Erro no cron CoinStats (Fear & Greed):', err.message)
  }
})

// Cron job: BTC Dominance a cada hora
cron.schedule('0 * * * *', async () => {
  try {
    await getBTCDominanceAndSave(pool)
    console.log('CoinStats BTC Dominance salvo!')
  } catch (err) {
    console.error('Erro no cron CoinStats (BTC Dominance):', err.message)
  }
})

app.listen(PORT, () => {
  console.log(`🚀 market-bot ouvindo na porta ${PORT}`)
})
