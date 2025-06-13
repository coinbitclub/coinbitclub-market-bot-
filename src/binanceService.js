import axios from 'axios';
import crypto from 'crypto';

const BASE = 'https://api.binance.com';

function sign(query, secret) {
  return crypto.createHmac('sha256', secret).update(query).digest('hex');
}

export async function placeBinanceOrder({
  apiKey,
  apiSecret,
  symbol,
  side = 'BUY',
  qty,
  price,
  tpPercent,
  slPercent
}) {
  const ts = Date.now();
  const takeProfitPrice = (price * (1 + tpPercent / 100)).toFixed(8);
  const stopLossPrice   = (price * (1 - slPercent / 100)).toFixed(8);

  // exemplo: primeiro abre market e depois OCO para TP/SL
  const orderQuery = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${qty}&timestamp=${ts}`;
  const signature1 = sign(orderQuery, apiSecret);
  await axios.post(`${BASE}/api/v3/order?${orderQuery}&signature=${signature1}`, null, {
    headers: { 'X-MBX-APIKEY': apiKey }
  });

  // então cria OCO (ou ordens separadas conforme API)
  const ocoQuery = `symbol=${symbol}&side=SELL&type=OCO&quantity=${qty}&price=${takeProfitPrice}` +
                   `&stopPrice=${stopLossPrice}&stopLimitPrice=${stopLossPrice}&stopLimitTimeInForce=GTC&timestamp=${Date.now()}`;
  const signature2 = sign(ocoQuery, apiSecret);
  const { data } = await axios.post(`${BASE}/api/v3/order/oco?${ocoQuery}&signature=${signature2}`, null, {
    headers: { 'X-MBX-APIKEY': apiKey }
  });

  return data;
}
