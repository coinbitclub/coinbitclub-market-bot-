CREATE TABLE signals (
id SERIAL PRIMARY KEY,
ticker TEXT NOT NULL,
signal_time TIMESTAMP NOT NULL,
diff_btc_ema7 NUMERIC,
cruzou_acima_ema9 BOOLEAN,
cruzou_abaixo_ema9 BOOLEAN,
raw_payload JSONB NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_signals_time ON signals(created_at);
