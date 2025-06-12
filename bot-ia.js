import 'dotenv/config';
import { Pool } from 'pg';
import axios from 'axios';
import OpenAI from 'openai';
import cron from 'node-cron';

const {
  OPENAI_API_KEY,
  DATABASE_URL,
  WHATSAPP_NUMBER,
  ZAPI_INSTANCE_URL,
  ZAPI_TOKEN
} = process.env;

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function enviarWhatsappZapi(numero, mensagem) {
  try {
    const { data } = await axios.post(
      `${ZAPI_INSTANCE_URL}/send-message`,
      { phone: numero, message: mensagem },
      { headers: { 'Content-Type': 'application/json', Authorization: ZAPI_TOKEN } }
    );
    console.log('WhatsApp enviado:', data);
  } catch (e) {
    console.error('Erro WhatsApp:', e.response?.data || e.message);
  }
}

async function monitorarOrdensEExecutarIA() {
  try {
    const { rows: ordens } = await pool.query("SELECT * FROM orders WHERE status='aberta'");
    const contexto = { ordens, timestamp: new Date().toISOString() };

    const resposta = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é uma IA especialista em trading automatizado...'
        },
        {
          role: 'user',
          content: JSON.stringify(contexto, null, 2)
        }
      ]
    });

    const analise = resposta.choices[0].message.content;
    console.log('IA analisou:', analise);
    await enviarWhatsappZapi(WHATSAPP_NUMBER, `🚨 IA CoinBitClub:\n\n${analise}`);
    await pool.query(
      `INSERT INTO audit_logs (evento, detalhes, status, payload)
       VALUES ($1,$2,$3,$4)`,
      ['análise_ia', analise, 'sucesso', JSON.stringify(contexto)]
    );
  } catch (e) {
    console.error('Erro IA:', e);
    await enviarWhatsappZapi(WHATSAPP_NUMBER, `❌ Erro IA: ${e.message}`);
    await pool.query(
      `INSERT INTO audit_logs (evento, detalhes, status)
       VALUES ($1,$2,$3)`,
      ['erro_bot_ia', e.message, 'falha']
    );
  }
}

async function enviarRelatorioDiario() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE status='fechada' AND fechada_em > NOW() - INTERVAL '1 day'"
    );
    const resumo = `Relatório diário:\n${JSON.stringify(rows, null, 2)}`;
    await enviarWhatsappZapi(WHATSAPP_NUMBER, resumo);
    console.log('Relatório enviado');
  } catch (e) {
    console.error('Erro relatório:', e);
  }
}

// Cron - IA a cada 4h e relatório diário às 8h
cron.schedule('0 */4 * * *', monitorarOrdensEExecutarIA);
cron.schedule('0 8 * * *', enviarRelatorioDiario);

console.log('Bot IA rodando...');
