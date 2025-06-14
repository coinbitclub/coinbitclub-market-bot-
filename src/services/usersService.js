// src/services/usersService.js
import { executeQuery } from './databaseService.js';

export async function saveUser({
  id, nome, email, assinatura_inicio, assinatura_fim,
  exchange, api_key, api_secret, configs_id
}) {
  const query = `
    INSERT INTO users (
      id, nome, email, assinatura_inicio, assinatura_fim,
      exchange, api_key, api_secret, configs_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (id) DO UPDATE SET
      nome = EXCLUDED.nome,
      email = EXCLUDED.email,
      assinatura_inicio = EXCLUDED.assinatura_inicio,
      assinatura_fim = EXCLUDED.assinatura_fim,
      exchange = EXCLUDED.exchange,
      api_key = EXCLUDED.api_key,
      api_secret = EXCLUDED.api_secret,
      configs_id = EXCLUDED.configs_id;
  `;
  const params = [
    id, nome, email, assinatura_inicio, assinatura_fim,
    exchange, api_key, api_secret, configs_id
  ];
  return await executeQuery(query, params);
}

export async function getUserById(user_id) {
  const query = `SELECT * FROM users WHERE id = $1;`;
  return await executeQuery(query, [user_id]);
}
