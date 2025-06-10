import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = process.env.WEBHOOK_SECRET || "210406";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "sua_chave_aes_32caracteres"; // Troque por uma chave forte
const IV_LENGTH = 16;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Função de criptografia (AES-256)
function encrypt(text) {
  if (!text) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "utf8"),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  if (!text) return "";
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "utf8"),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Rota principal de status
app.get("/", (req, res) => {
  res.send("Webhook CoinBitClub está ativo 🎯");
});

// Rota de webhook (TradingView)
app.post("/webhook", async (req, res) => {
  const token = req.query.token;
  if (token !== SECRET) {
    return res.status(403).send("Invalid token.");
  }
  try {
    await pool.query(
      "INSERT INTO signals (raw_payload) VALUES ($1)",
      [req.body]
    );
    res.status(200).send("Signal received!");
  } catch (error) {
    console.error("Erro ao registrar sinal:", error);
    res.status(500).send("Error saving signal.");
  }
});

// CRUD Simplificado: Usuário e Configurações (para Softr)
app.post("/user", async (req, res) => {
  const { nome, email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (nome, email, assinatura_status, assinatura_data_inicio, assinatura_data_fim)
       VALUES ($1, $2, 'ativo', NOW(), NOW() + INTERVAL '30 days')
       ON CONFLICT(email) DO UPDATE SET nome=EXCLUDED.nome RETURNING user_id`,
      [nome, email]
    );
    res.json({ user_id: result.rows[0].user_id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/user/settings", async (req, res) => {
  const {
    user_id,
    bybit_api_key,
    bybit_api_secret,
    capital_per_order,
    leverage,
    stop_loss_type,
    stop_loss_value,
    telegram_id,
    whatsapp_number,
    notificacao_email,
    notificacao_telegram,
    notificacao_whatsapp,
  } = req.body;
  try {
    await pool.query(
      `INSERT INTO user_settings (
        user_id, bybit_api_key, bybit_api_secret, capital_per_order, leverage, stop_loss_type, stop_loss_value,
        telegram_id, whatsapp_number, notificacao_email, notificacao_telegram, notificacao_whatsapp
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
      ON CONFLICT(user_id) DO UPDATE SET
        bybit_api_key = EXCLUDED.bybit_api_key,
        bybit_api_secret = EXCLUDED.bybit_api_secret,
        capital_per_order = EXCLUDED.capital_per_order,
        leverage = EXCLUDED.leverage,
        stop_loss_type = EXCLUDED.stop_loss_type,
        stop_loss_value = EXCLUDED.stop_loss_value,
        telegram_id = EXCLUDED.telegram_id,
        whatsapp_number = EXCLUDED.whatsapp_number,
        notificacao_email = EXCLUDED.notificacao_email,
        notificacao_telegram = EXCLUDED.notificacao_telegram,
        notificacao_whatsapp = EXCLUDED.notificacao_whatsapp`,
      [
        user_id,
        encrypt(bybit_api_key),
        encrypt(bybit_api_secret),
        capital_per_order,
        leverage,
        stop_loss_type,
        stop_loss_value,
        telegram_id,
        whatsapp_number,
        notificacao_email,
        notificacao_telegram,
        notificacao_whatsapp,
      ]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/user/settings/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM user_settings WHERE user_id=$1",
      [user_id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "not found" });
    const safe = { ...result.rows[0] };
    delete safe.bybit_api_key;
    delete safe.bybit_api_secret;
    res.json(safe);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
