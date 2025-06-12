import axios from 'axios';
import { save } from './databaseService.js';

const URL_FG   = 'https://openapiv1.coinstats.app/insights/fear-and-greed';
const URL_DOM  = 'https://openapiv1.coinstats.app/insights/btc-dominance';

export async function getFearAndGreedAndSave() {
  try {
    const { data } = await axios.get(URL_FG);
    await save('coinstats_fear_greed', JSON.stringify(data));
    console.log('[CoinStats] Fear & Greed salvo!');
  } catch (err) {
    console.error('[CoinStats] Cron Fear & Greed:', err.message);
  }
}

export async function getBTCDominanceAndSave() {
  try {
    const { data } = await axios.get(URL_DOM);
    await save('coinstats_btc_dominance', JSON.stringify(data));
    console.log('[CoinStats] BTC Dominance salvo!');
  } catch (err) {
    console.error('[CoinStats] Cron BTC Dominance:', err.message);
  }
}
