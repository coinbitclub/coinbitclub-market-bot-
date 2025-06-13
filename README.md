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
