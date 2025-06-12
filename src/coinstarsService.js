import axios from 'axios'

const COINSTATS_BASE = 'https://api.coinstats.app/public/v1'
const API_KEY = process.env.COINSTATS_API_KEY.trim()

export async function getFearGreedIndexAndSave(pool) {
  const url = `${COINSTATS_BASE}/fear-and-greed`
  const { data } = await axios.get(url, {
    headers: { 'X-API-KEY': API_KEY }
  })
  const raw = JSON.stringify(data)
  await pool.query(
    `INSERT INTO coinstats_fear_greed (raw_payload) VALUES ($1)`,
    [raw]
  )
}

export async function getBTCDominanceAndSave(pool) {
  const url = `${COINSTATS_BASE}/btc-dominance`
  const { data } = await axios.get(url, {
    headers: { 'X-API-KEY': API_KEY }
  })
  const raw = JSON.stringify(data)
  await pool.query(
    `INSERT INTO coinstats_btc_dominance (raw_payload) VALUES ($1)`,
    [raw]
  )
}
