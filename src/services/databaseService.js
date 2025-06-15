 // src/services/databaseService.js
 import pkg from 'pg';
 const { Pool } = pkg;

 const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
   ssl: { rejectUnauthorized: false } // Railway usa SSL!
 });

-export async function executeQuery(query, params = []) {
+export async function executeQuery(query, params = []) {
   const client = await pool.connect();
   try {
     const res = await client.query(query, params);
     return res.rows;
   } catch (err) {
     console.error('Database query error:', err);
     throw err;
   } finally {
     client.release();
   }
 }

+// alias para compatibilidade com quem já usava `query()`
+export const query = executeQuery;
