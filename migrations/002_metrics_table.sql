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
