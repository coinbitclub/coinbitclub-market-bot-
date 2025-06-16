import db from '../db.js';

export async function saveDominance(data) {
  await db.query(
    `INSERT INTO dominance (btc_dominance, date) VALUES ($1, $2)`,
    [data.btc_dominance, data.date]
  );
}
