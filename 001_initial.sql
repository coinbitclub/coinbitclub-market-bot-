-- clients
CREATE TABLE IF NOT EXISTS clients (
  id                 SERIAL PRIMARY KEY,
  softr_client_id    TEXT UNIQUE NOT NULL,
  bybit_api_key      TEXT NOT NULL,
  bybit_api_secret   TEXT NOT NULL,
  leverage           INT NOT NULL,
  order_value        NUMERIC NOT NULL,
  plan_name          TEXT NOT NULL,
  subscription_start TIMESTAMPTZ NOT NULL,
  subscription_end   TIMESTAMPTZ NOT NULL,
  created_at         TIMESTAMPTZ DEFAULT now()
);

-- operations
CREATE TABLE IF NOT EXISTS operations (
  id             SERIAL PRIMARY KEY,
  client_id      INT REFERENCES clients(id),
  symbol         TEXT NOT NULL,
  side           TEXT NOT NULL,
  qty            NUMERIC NOT NULL,
  price          NUMERIC NOT NULL,
  resultado      NUMERIC,
  bybit_response JSONB,
  reference_code TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- market_mode
CREATE TABLE IF NOT EXISTS market_mode (
  id         SERIAL PRIMARY KEY,
  mode       TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
