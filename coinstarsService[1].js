import axios from 'axios';

export async function getMarketSentiment() {
  const resp = await axios.get('https://api.coinstars.news/sentiment', {
    headers: { 'Authorization': `Bearer ${process.env.COINSTARS_API_KEY}` }
  });
  return resp.data;
}
