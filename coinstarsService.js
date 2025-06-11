// coinstarsService.js
import axios from 'axios';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const COINSTARS_API_KEY = process.env.COINSTARS_API_KEY; // coloque sua chave .env

export async function fetchAndSaveFearGreed() {
  try {
    const { data } = await axios.get('https://api.coinstars.com.br/api/feargreed', {
      headers: { 'x-api-key': COINSTARS_API_KEY }
    });

    // supondo que data.result seja o índice
    const index = data.result?.value ?? null;
    const timestamp = new Date();

    if (index !== null) {
      await pool.query(
        `INSERT INTO market_mode (received_at, fear_greed) VALUES ($1, $2)`,
        [timestamp, index]
      );
      console.log(`Medo & Ganância salvo: ${index}`);
    }
  } catch (err) {
    console.error('Erro ao buscar/salvar F&G:', err.message);
  }
}
