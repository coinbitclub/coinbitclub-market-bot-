-- migrations/002_add_indexes.sql

-- Índices de performance para signals
CREATE INDEX IF NOT EXISTS idx_signals_time    ON signals(time);
CREATE INDEX IF NOT EXISTS idx_signals_ticker  ON signals(ticker);

-- Índice para dominance
CREATE INDEX IF NOT EXISTS idx_dom_timestamp   ON dominance(timestamp);

-- Índice opcional para raw_webhook
CREATE INDEX IF NOT EXISTS idx_raw_route       ON raw_webhook(route);
