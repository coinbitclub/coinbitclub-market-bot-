import axios from 'axios';
import crypto from 'crypto';

const API_BASE = 'https://api.bybit.com';

export async function placeOrder({ apiKey, apiSecret, symbol, side, qty, price, leverage }) {
  const params = {
    api_key: apiKey,
    symbol,
    side,
    order_type: 'Market',
    qty,
    timestamp: Date.now(),
    leverage
  };
  
  const sign = signParams(params, apiSecret);

  const resp = await axios.post(`${API_BASE}/v2/private/order/create`, null, {
    params: { ...params, sign }
  });

  return resp.data;
}

function signParams(params, secret) {
  const qs = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');

  return crypto.createHmac('sha256', secret).update(qs).digest('hex');
}
