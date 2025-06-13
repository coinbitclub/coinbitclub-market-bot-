// =====================================================
// Estrutura de Pastas Final
// =====================================================
// coinbitclub-market-bot/
// ├── migrations/
// │   ├── 001_initial.sql
// │   ├── 002_metrics_table.sql
// │   └── db-init.sql
// ├── src/
// │   ├── index.js
// │   ├── logger.js
// │   ├── databaseService.js
// │   ├── bybitService.js
// │   ├── binanceService.js
// │   ├── coinstatsService.js
// │   ├── coinbaseService.js
// │   ├── kiwifyService.js
// │   ├── exchangeService.js
// │   ├── encryption.js
// │   ├── signals.js
// │   ├── webhooks.js
// │   ├── utils/
// │   │   └── scheduler.js
// │   └── tradingBot.js
// ├── .env.example
// ├── .gitignore
// ├── Dockerfile
// ├── package.json
// └── README.md

/* =============================================
   migrations/001_initial.sql
   ============================================= */
-- (mesma definição de users, subscriptions, orders)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  softr_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  plan TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  exchange TEXT NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL,
  qty NUMERIC NOT NULL,
  entry_price NUMERIC NOT NULL,
  leverage INT NOT NULL,
  tp_percent NUMERIC NOT NULL,
  sl_percent NUMERIC NOT NULL,
  status TEXT NOT NULL,
  profit_loss NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

/* =============================================
   migrations/002_metrics_table.sql
   ============================================= */
-- Tabela para armazenar métricas de mercado
CREATE TABLE market_metrics (
  id SERIAL PRIMARY KEY,
  captured_at TIMESTAMP NOT NULL,
  volume_24h NUMERIC,
  market_cap NUMERIC,
  dominance NUMERIC,
  altcoin_season TEXT,
  rsi_market NUMERIC
);

/* =============================================
   migrations/db-init.sql
   ============================================= */
-- Índices para performance
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_metrics_time ON market_metrics(captured_at);

/* =============================================
   .env.example
   ============================================= */
// Server
PORT=3000

// Database
DATABASE_URL=postgres://USER:PASS@HOST:PORT/DB_NAME

// Exchanges
BYBIT_API_KEY=
BYBIT_API_SECRET=
BINANCE_API_KEY=
BINANCE_API_SECRET=

// Data sources
COINSTATS_API_KEY=
COINBASE_API_KEY=
COINBASE_API_SECRET=

// IA & Webhooks
OPENAI_API_KEY=
TRADINGVIEW_WEBHOOK_TOKEN=210406

// Softr & Kiwify
SOFTR_API_TOKEN=
KIWIFY_API_TOKEN=

/* =============================================
   package.json
   ============================================= */
{
  "name": "coinbitclub-market-bot",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "migrate": "psql $DATABASE_URL -f migrations/001_initial.sql && psql $DATABASE_URL -f migrations/002_metrics_table.sql && psql $DATABASE_URL -f migrations/db-init.sql"
  },
  "dependencies": {
    "axios": "^1.4.0",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "openai": "^4.0.0",
    "pg": "^8.10.0",
    "winston": "^3.8.2",
    "node-cron": "^3.0.0"
  }
}

/* =============================================
   Dockerfile
   ============================================= */
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
CMD ["node","src/index.js"]

/* =============================================
   README.md
   ============================================= */
# CoinBitClub Market Bot

**Projeto**: robô de trading automatizado (Bybit + Binance)

## Setup

1. Clone o repositório
2. `cp .env.example .env` e preencha suas credenciais
3. `npm run migrate`
4. `npm start`

## Fluxo

- Alerts do TradingView para `/webhook/signal`
- Verifica assinatura (Softr/Kiwify)
- Executa ordens na Bybit/Binance
- Persiste `orders`
- Captura métricas 3×/dia (Coinbase) + F&G
- Armazena em `market_metrics`
- Retraining IA e monitoramento a cada minuto

## Infra & Deploy

Use Railway (testes) ou Droplet 4vCPU/8GB (produção). Apontar CI/CD via GitHub Actions.

/* =============================================
   src/index.js
   ============================================= */
import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './webhooks.js';
import { setupScheduler } from './utils/scheduler.js';
import { logger } from './logger.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/', webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  setupScheduler();
});

/* =============================================
   src/logger.js
   ============================================= */
import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

const transport = new transports.DailyRotateFile({
  filename: 'logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d'
});

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) =>
      `${timestamp} [${level.toUpperCase()}] ${message}`)
  ),
  transports: [transport, new transports.Console()]
});

/* =============================================
   src/databaseService.js
   ============================================= */
import pkg from 'pg';
import { logger } from './logger.js';
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    logger.info(`DB QUERY ${text} [${Date.now()-start}ms]`);
    return res;
  } catch (err) {
    logger.error(`DB ERROR ${err.message}`);
    throw err;
  }
}

/* =============================================
   src/coinstatsService.js
   ============================================= */
import axios from 'axios';
const BASE = 'https://api.coinstats.app/public/v1';
export async function getFearGreedAndDominance(apiKey) {
  const { data } = await axios.get(`${BASE}/global?apikey=${apiKey}`);
  return { fearGreed: data.fearGreedIndex, dominance: data.marketCapPercentage.btc };
}

/* =============================================
   src/coinbaseService.js
   ============================================= */
import axios from 'axios';
const CB_BASE = 'https://api.pro.coinbase.com';
export async function getCoinbaseMetrics() {
  // Volume 24h e preços de todos os pares BTC-USD
  const { data: stats } = await axios.get(`${CB_BASE}/products/BTC-USD/stats`);
  // TODO: market cap, dominance, altcoin season & RSI de mercado (usar fontes externas ou cálculos próprios)
  return {
    volume_24h: parseFloat(stats.volume),
    market_cap: null,
    dominance: null,
    altcoin_season: null,
    rsi_market: null
  };
}

/* =============================================
   src/tradingBot.js
   ============================================= */
import { getFearGreedAndDominance } from './coinstatsService.js';
import { getCoinbaseMetrics } from './coinbaseService.js';
import { query } from './databaseService.js';
import { fetchOpenPositions, closePosition } from './exchangeService.js';
import { logger } from './logger.js';
import OpenAI from 'openai';

const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function dailyRetraining() {
  const fgd = await getFearGreedAndDominance(process.env.COINSTATS_API_KEY);
  const cbm = await getCoinbaseMetrics();
  // Armazena métricas
  await query(`INSERT INTO market_metrics(captured_at, volume_24h, market_cap, dominance, altcoin_season, rsi_market)
              VALUES(NOW(), $1,$2,$3,$4,$5)`,
              [cbm.volume_24h, cbm.market_cap, cbm.dominance, cbm.altcoin_season, cbm.rsi_market]);
  logger.info(`Retraining IA — F&G=${fgd.fearGreed} DOM=${fgd.dominance}`);
  // lógica de fine-tune ou ajuste dinâmico com ai
}

export async function monitorOpenPositions() {
  const positions = await fetchOpenPositions();
  for (const pos of positions) {
    const profitPct = ((pos.currentPrice-pos.entryPrice)/pos.entryPrice)*100*(pos.side==='LONG'?1:-1);
    if (profitPct>=3) await closePosition(pos.id);
    // ganchos para dominância e EMA reverso via webhook
  }
}

/* =============================================
   src/utils/scheduler.js
   ============================================= */
import cron from 'node-cron';
import { dailyRetraining, monitorOpenPositions } from '../tradingBot.js';

export function setupScheduler() {
  cron.schedule('5 0 * * *', dailyRetraining);
  cron.schedule('0 6,14,22 * * *', dailyRetraining); // 3× dia na Coinbase
  cron.schedule('* * * * *', monitorOpenPositions);
}

/* =============================================
   src/signals.js
   ============================================= */
export function parseSignal(payload) {
  return {
    symbol: payload.ticker,
    diffBtcEma7: Number(payload.diff_btc_ema7),
    cruzouAcimaEma9: payload.cruzou_acima_ema9===1,
    cruzouAbaixoEma9: payload.cruzou_abaixo_ema9===1,
    leverage: Number(payload.leverage||6)
  };
}

/* =============================================
   src/exchangeService.js
   ============================================= */
export { placeBybitOrder } from './bybitService.js';
export { placeBinanceOrder } from './binanceService.js';
export async function fetchOpenPositions() {
  // Implementar fetch em Bybit/Binance via API
  return [];
}
export async function closePosition(id) {
  // Implementar cancelamento/fechamento
}

/* =============================================
   src/webhooks.js
   ============================================= */
import express from 'express';
import { logger } from './logger.js';
import { parseSignal } from './signals.js';
import { placeBybitOrder, placeBinanceOrder } from './exchangeService.js';

const router = express.Router();

router.post('/webhook/signal', async (req, res) => {
  try {
    const s = parseSignal(req.body);
    if (s.diffBtcEma7>=0.3 && s.cruzouAcimaEma9) {
      await placeBybitOrder({ ...s, apiKey: process.env.BYBIT_API_KEY, apiSecret: process.env.BYBIT_API_SECRET, tpPercent: s.leverage, slPercent: 2*s.leverage });
      return res.status(200).send('LONG executed');
    }
    if (s.diffBtcEma7<=-0.3 && s.cruzouAbaixoEma9) {
      await placeBybitOrder({ ...s, apiKey: process.env.BYBIT_API_KEY, apiSecret: process.env.BYBIT_API_SECRET, side:'Sell', tpPercent: s.leverage, slPercent: 2*s.leverage });
      return res.status(200).send('SHORT executed');
    }
    res.status(200).send('No action');
  } catch (err) {
    logger.error(err.stack);
    res.status(500).send('Error');
  }
});

router.post('/webhook/dominance', (req,res)=>res.send('OK'));

export default router;
