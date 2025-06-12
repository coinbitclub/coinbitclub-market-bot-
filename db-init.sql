CREATE TABLE IF NOT EXISTS coinstats_fear_greed (
  id SERIAL PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_payload JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS coinstats_btc_dominance (
  id SERIAL PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_payload JSONB NOT NULL
);
