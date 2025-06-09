import axios from 'axios';

const API_BASE = 'https://api.bybit.com';

export async function placeOrder({ apiKey, apiSecret, symbol, side, qty, price, leverage }) {
  const params = {
    api_key: apiKey,
    symbol,
    side,
    order_type: 'Market',
    qty,
    time_in_force: 'PostOnly',
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
  const qs = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return require('crypto').createHmac('sha256', secret).update(qs).digest('hex');
}
