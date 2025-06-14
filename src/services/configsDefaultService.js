// src/services/configsDefaultService.js
import { executeQuery } from './databaseService.js';

export async function getDefaultConfigs() {
  const query = `SELECT * FROM configs_default WHERE ativa = true LIMIT 1;`;
  return await executeQuery(query);
}

export async function saveDefaultConfigs(configs) {
  // Exemplo: configs = { ... }
  const query = `
    INSERT INTO configs_default (/* campos */)
    VALUES (/* valores */)
    RETURNING id;
  `;
  // Ajuste conforme os campos da sua tabela
  return await executeQuery(query, [/* valores */]);
}
