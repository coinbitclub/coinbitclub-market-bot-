CREATE TABLE user_credentials (
id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
exchange TEXT NOT NULL,
api_key TEXT NOT NULL,
api_secret TEXT NOT NULL,
settings JSONB DEFAULT '{}'
);
CREATE INDEX idx_credentials_user ON user_credentials(user_id);
