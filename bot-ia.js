// bot-ia.js
import { Pool } from "pg";
import axios from "axios";
import OpenAI from "openai";
import cron from "node-cron";

// === VARIÁVEIS DE AMBIENTE (configure no Railway) ===
// OPENAI_API_KEY        - sua chave da OpenAI
// DATABASE_URL          - URL do PostgreSQL no Railway
// WHATSAPP_NUMBER       - Ex: 5521987386645 (SEM +, espaços ou parênteses)
// ZAPI_INSTANCE_URL     - Ex: https://api.z-api.io/instance12345/
// ZAPI_TOKEN            - Token de autenticação da sua Z-API

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// === Função para enviar mensagem via Z-API ===
async function enviarWhatsappZapi(numero, mensagem) {
  const instanceUrl = process.env.ZAPI_INSTANCE_URL; // Ex: https://api.z-api.io/instance12345/
  const token = process.env.ZAPI_TOKEN;

  const url = `${instanceUrl}/send-message`;
  try {
    const { data } = await axios.post(
      url,
      {
        phone: numero, // Exemplo: "5521987386645"
        message: mensagem
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      }
    );
    console.log("Mensagem WhatsApp enviada!", data);
    return data;
  } catch (e) {
    console.error("Erro ao enviar mensagem no WhatsApp:", e.response?.data || e.message);
    return null;
  }
}

// === Função principal de monitoramento e análise IA ===
async function monitorarOrdensEExecutarIA() {
  try {
    // 1. Buscar ordens abertas
    const { rows: ordens } = await pool.query("SELECT * FROM orders WHERE status='aberta'");

    // 2. (Exemplo) Buscar contexto de mercado e notícias (substitua por fontes reais)
    const contextoMercado = {
      sinais: [],
      baleias: [],
      noticias: [],
    };

    // 3. Montar prompt para IA
    const messages = [
      {
        role: "system",
        content:
          "Você é uma IA especialista em trading automatizado no mercado de criptomoedas, um ambiente de extrema volatilidade e forte influência de movimentos de grandes players ('baleias'). Seu dever é monitorar continuamente o mercado global, analisar dados em tempo real, identificar padrões suspeitos de movimentação de baleias e antecipar movimentos bruscos. Fique atento a notícias e relatórios econômicos globais que possam impactar o preço dos ativos digitais. Sua prioridade é proteger o capital, fechar operações no lucro sempre que possível, e nunca permitir grandes prejuízos. Em caso de movimento abrupto ou risco elevado, feche todas as operações imediatamente para preservar o saldo. Relate e corrija erros automaticamente no sistema, sempre sugerindo melhorias para o fluxo operacional. Se o usuário tiver alguma dificuldade técnica ou dúvida sobre a automação, explique passo a passo e proponha as melhores práticas para manter o sistema sempre otimizado e seguro."
      },
      {
        role: "user",
        content:
          `Ordens abertas: ${JSON.stringify(ordens)}
           Contexto de mercado: ${JSON.stringify(contextoMercado)}`
      }
    ];

    // 4. Consulta IA (OpenAI)
    const resposta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const analise = resposta.choices[0].message.content;
    console.log("Análise da IA:", analise);

    // 5. Enviar alerta de monitoramento no WhatsApp
    await enviarWhatsappZapi(process.env.WHATSAPP_NUMBER, "🚨 Análise IA CoinBitClub:\n\n" + analise);

    // 6. Registrar auditoria
    await pool.query(
      `INSERT INTO audit_logs (evento, detalhes, status, payload)
       VALUES ($1, $2, $3, $4)`,
      [
        "análise_ia",
        analise,
        "sucesso",
        JSON.stringify({ ordens, contextoMercado })
      ]
    );

  } catch (e) {
    console.error("Erro no bot IA:", e);
    await enviarWhatsappZapi(process.env.WHATSAPP_NUMBER, "❌ Erro no bot IA CoinBitClub: " + (e.message || e));
    await pool.query(
      `INSERT INTO audit_logs (evento, detalhes, status)
       VALUES ($1, $2, $3)`,
      ["erro_bot_ia", e.message, "falha"]
    );
  }
}

// === Função para enviar relatório de acompanhamento 1 vez por dia ===
async function enviarRelatorioDiario() {
  try {
    // Exemplo de resumo simples (substitua por relatório real)
    const { rows: ordensFechadas } = await pool.query("SELECT * FROM orders WHERE status='fechada' AND fechada_em > NOW() - INTERVAL '1 day'");
    const resumo = `Relatório diário CoinBitClub:\n\nOrdens fechadas nas últimas 24h:\n${JSON.stringify(ordensFechadas, null, 2)}`;
    await enviarWhatsappZapi(process.env.WHATSAPP_NUMBER, resumo);
    console.log("Relatório diário enviado!");
  } catch (e) {
    console.error("Erro ao enviar relatório diário:", e.message);
  }
}

// === AGENDAMENTOS ===
// Monitoramento IA a cada 4h
cron.schedule("0 */4 * * *", monitorarOrdensEExecutarIA); // a cada 4 horas, minuto zero
// Relatório de acompanhamento diário às 8h da manhã
cron.schedule("0 8 * * *", enviarRelatorioDiario); // todo dia às 8:00

console.log("Bot IA CoinBitClub rodando! Monitoramento e alertas automáticos via WhatsApp.");
