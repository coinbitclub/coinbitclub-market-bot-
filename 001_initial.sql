-- USERS
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  assinatura_status VARCHAR(20) DEFAULT 'ativo',
  assinatura_data_inicio TIMESTAMP,
  assinatura_data_fim TIMESTAMP
);

-- USER SETTINGS
CREATE TABLE IF NOT EXISTS user_settings (
  user_id INTEGER PRIMARY KEY REFERENCES users(user_id),
  bybit_api_key TEXT,
  bybit_api_secret TEXT,
  capital_per_order NUMERIC,
  leverage INTEGER,
  stop_loss_type VARCHAR(20),
  stop_loss_value NUMERIC,
  telegram_id VARCHAR(50),
  whatsapp_number VARCHAR(20),
  notificacao_email BOOLEAN DEFAULT FALSE,
  notificacao_telegram BOOLEAN DEFAULT FALSE,
  notificacao_whatsapp BOOLEAN DEFAULT TRUE
);

-- SIGNALS (Webhook TradingView)
CREATE TABLE IF NOT EXISTS signals (
  id SERIAL PRIMARY KEY,
  received_at TIMESTAMP DEFAULT NOW(),
  raw_payload JSONB
);

-- ORDERS (execução, controle e histórico)
CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  signal_id INTEGER REFERENCES signals(id),
  status VARCHAR(20) DEFAULT 'aberta',
  tipo VARCHAR(10),
  symbol VARCHAR(20),
  entry_price NUMERIC,
  exit_price NUMERIC,
  volume NUMERIC,
  resultado NUMERIC,
  aberta_em TIMESTAMP DEFAULT NOW(),
  fechada_em TIMESTAMP
);

-- AUDIT LOGS (monitoramento IA e erros)
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  data TIMESTAMP DEFAULT NOW(),
  evento VARCHAR(100),
  detalhes TEXT,
  status VARCHAR(20),
  payload JSONB
);
