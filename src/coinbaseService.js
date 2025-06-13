/* =============================================
   src/coinbaseService.js
   ============================================= */
import axios from 'axios';
const CB_BASE = 'https://api.pro.coinbase.com';
export async function getCoinbaseMetrics() {
  // Volume 24h e preços de todos os pares BTC-USD
  const { data: stats } = await axios.get(`${CB_BASE}/products/BTC-USD/stats`);
  // TODO: market cap, dominance, altcoin season & RSI de mercado (usar fontes externas ou cálculos próprios)
  return {
    volume_24h: parseFloat(stats.volume),
    market_cap: null,
    dominance: null,
    altcoin_season: null,
    rsi_market: null
  };
}
