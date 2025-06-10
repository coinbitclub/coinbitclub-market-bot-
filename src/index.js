import express from 'express';
import verifySubscription from '../verifySubscription.js';
import { getLatestMarketMode, saveOperation } from '../databaseService.js';
import { placeOrder } from '../bybitService.js';
import { getMarketSentiment } from '../coinstarsService.js';

const app = express();
app.use(express.json());

// Health-check
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', time: new Date().toISOString() })
);

// Webhook endpoint
app.post('/webhook', verifySubscription, async (req, res) => {
  if (req.query.token !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { ticker, preco, setup, reference_code } = req.body;
  const marketMode = await getLatestMarketMode();
  if (marketMode !== setup) {
    return res
      .status(200)
      .json({ status: 'ignored', reason: 'market_mode mismatch' });
  }

  const client = req.client;
  try {
    const bybitRes = await placeOrder({
      apiKey: client.bybit_api_key,
      apiSecret: client.bybit_api_secret,
      symbol: ticker,
      side: setup,
      qty: client.order_value,
      price: preco,
      leverage: client.leverage
    });

    await saveOperation({
      client_id: client.id,
      symbol: ticker,
      side: setup,
      qty: client.order_value,
      price: preco,
      resultado: bybitRes.result?.filled_qty ?? null,
      bybit_response: bybitRes,
      reference_code
    });

    return res.json({ status: 'executed', order: bybitRes });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: 'order_failed', details: err.response?.data || err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
