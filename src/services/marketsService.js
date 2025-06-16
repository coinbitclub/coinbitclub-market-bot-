import db from '../db.js';

export async function saveMarkets(markets) {
  for (const m of markets) {
    await db.query(
      `INSERT INTO markets (symbol, price, change, volume) VALUES ($1,$2,$3,$4) 
      ON CONFLICT (symbol) DO UPDATE SET price=$2, change=$3, volume=$4`,
      [m.symbol, m.price, m.change, m.volume]
    );
  }
}
