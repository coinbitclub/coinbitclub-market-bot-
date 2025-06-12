import axios from 'axios';
import crypto from 'crypto';

const API_BASE = 'https://api.bybit.com';

export async function placeOrder({ apiKey, apiSecret, symbol, side, qty, leverage }) {
  const params = {
    api_key: apiKey,
    symbol,
    side,
    order_type: 'Market',
    qty,
    timestamp: Date.now(),
    leverage
  };
  const sign = crypto
    .createHmac('sha256', apiSecret)
    .update(Object.keys(params)
      .sort()
      .map(k => `${k}=${params[k]}`)
      .join('&'))
    .digest('hex');

  const resp = await axios.post(`${API_BASE}/v2/private/order/create`, null, {
    params: { ...params, sign }
  });
  return resp.data;
}
