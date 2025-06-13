CREATE TABLE fear_greed (
id SERIAL PRIMARY KEY,
captured_at TIMESTAMP NOT NULL,
value INT NOT NULL
);
CREATE INDEX idx_fg_time ON fear_greed(captured_at);
