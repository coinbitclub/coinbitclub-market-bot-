# market-bot

API Node.js + Cron para:
- Receber webhooks de sinais (TradingView, Kiwify, etc).
- Cron jobs que coletam Fear & Greed e Dominância BTC a cada hora.
- Bot de IA com OpenAI e envio de alertas via WhatsApp.

## 🚀 Como rodar

1. Configure seu `.env` baseado em `.env.example`.
2. `npm install`
3. `npm start`  (ou `npm run start:dev` para dev)
4. Exponha a porta `3000` no seu container/servidor.

## Banco de Dados

Use o script `001_initial.sql` para criar as tabelas.

## Variáveis de ambiente

Consulte `.env.example`.

---
# market-bot
