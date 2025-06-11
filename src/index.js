import express from 'express';
import { Pool } from 'pg';
import { getFearGreedIndex, getBTCDominance } from './coinstarsService.js';

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const SECRET = process.env.WEBHOOK_SECRET;

// Webhook para sinais de moedas/setup
app.post('/webhook/signal', async (req, res) => {
    if (req.query.token !== SECRET) return res.status(401).json({error: "unauthorized"});
    try {
        await pool.query(
            `INSERT INTO signals (received_at, raw_payload) VALUES (NOW(), $1)`,
            [JSON.stringify(req.body)]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Webhook para sinais de dominância BTC.D
app.post('/webhook/dominance', async (req, res) => {
    if (req.query.token !== SECRET) return res.status(401).json({error: "unauthorized"});
    try {
        await pool.query(
            `INSERT INTO dominance_signals (received_at, raw_payload) VALUES (NOW(), $1)`,
            [JSON.stringify(req.body)]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});
app.get('/api/fear-greed', async (req, res) => {
  const fg = await getFearGreedIndex();
  res.json(fg);
});

app.get('/api/btc-dominance', async (req, res) => {
  const dominance = await getBTCDominance();
  res.json(dominance);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
