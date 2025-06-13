import axios from 'axios';
import crypto from 'crypto';

const BASE = 'https://api.bybit.com';

function sign(params, secret) {
  const qs = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');
  return crypto.createHash('sha256').update(qs + secret).digest('hex');
}

export async function placeBybitOrder({
  apiKey,
  apiSecret,
  symbol,
  side = 'Buy',
  qty,
  price,
  leverage,
  tpPercent,
  slPercent
}) {
  const params = {
    api_key: apiKey,
    symbol,
    side,
    order_type: 'Market',
    qty,
    price,
    time_in_force: 'PostOnly',
    timestamp: Date.now(),
    leverage,
    take_profit: (price * (1 + tpPercent / 100)).toString(),
    stop_loss:  (price * (1 - slPercent / 100)).toString()
  };
  params.sign = sign(params, apiSecret);
  const { data } = await axios.post(`${BASE}/v2/private/order/create`, null, { params });
  return data;
}
