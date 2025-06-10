-- Tabela de usuários (registro básico)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    nome VARCHAR(64),
    email VARCHAR(128) UNIQUE,
    assinatura_status VARCHAR(16),
    assinatura_data_inicio DATE,
    assinatura_data_fim DATE
);

-- Configurações personalizadas do usuário
CREATE TABLE IF NOT EXISTS user_settings (
    user_id INT REFERENCES users(user_id),
    bybit_api_key VARCHAR(255),
    bybit_api_secret VARCHAR(255),
    capital_per_order FLOAT CHECK (capital_per_order >= 0.01 AND capital_per_order <= 0.3),
    leverage INT CHECK (leverage BETWEEN 1 AND 10),
    max_orders INT DEFAULT 2,
    stop_loss_type VARCHAR(20),
    stop_loss_value FLOAT,
    telegram_id VARCHAR(64),
    whatsapp_number VARCHAR(20),
    notificacao_email BOOLEAN DEFAULT TRUE,
    notificacao_telegram BOOLEAN DEFAULT FALSE,
    notificacao_whatsapp BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id)
);

-- Registro de sinais recebidos do TradingView
CREATE TABLE IF NOT EXISTS signals (
    signal_id SERIAL PRIMARY KEY,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    raw_payload JSONB,
    user_id INT REFERENCES users(user_id)
);

-- Ordens (operações abertas/fechadas)
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    moeda VARCHAR(32),
    direcao VARCHAR(8),
    entrada FLOAT,
    saida FLOAT,
    resultado FLOAT,
    alavancagem INT,
    capital_usado FLOAT,
    aberta_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechada_em TIMESTAMP,
    status VARCHAR(16)
);

-- Logs/auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT,
    evento VARCHAR(64),
    detalhes TEXT,
    status VARCHAR(16),
    payload JSONB,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
