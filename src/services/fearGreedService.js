import db from '../db.js';

export async function saveFearGreed(data) {
  await db.query(
    `INSERT INTO fear_greed (value, classification, date) VALUES ($1, $2, $3)`,
    [data.value, data.classification, data.date]
  );
}
