import pkg from 'pg';
const { Pool } = pkg;
import { URL } from 'url';

// Config via DATABASE_URL
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default {
  async insert(table, payload) {
    const text = `INSERT INTO ${table}(raw_payload) VALUES($1)`;
    await pool.query(text, [payload]);
  },
  async query(text, params) {
    const res = await pool.query(text, params);
    return res.rows;
  }
};
