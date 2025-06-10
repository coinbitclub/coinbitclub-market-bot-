// bot-ia.js
import { Pool } from "pg";
import axios from "axios";
import OpenAI from "openai";
import cron from "node-cron";

// === CONFIGURAÇÕES ===
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL; // Exemplo Z-API/Twilio
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "seu_numero_whatsapp";
const DATABASE_URL = process.env.DATABASE_URL;

// === Conexão ao banco ===
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// === Cliente OpenAI ===
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// === Função principal de monitoramento ===
async function monitorarOrdensEExecutarIA() {
  try {
    // 1. Buscar ordens abertas, contexto de mercado, logs e notícias (exemplo simplificado)
    const { rows: ordens } = await pool.query("SELECT * FROM orders WHERE status='aberta'");
    // TODO: buscar sinais de mercado, notícias e logs relevantes

    // Exemplo de contexto fictício — substitua pelos dados reais do seu sistema!
    const contextoMercado = {
      sinais: [
        // Exemplo: {ativo: "BTCUSDT", direcao: "LONG", volume: "grande", volatilidade: "alta"}
      ],
      baleias: [
        // Exemplo: {movimento: "compra", valor: 5000000, horario: "2024-06-12T09:00:00Z"}
      ],
      noticias: [
        // Exemplo: "Fed vai anunciar novo relatório hoje"
      ]
    };

    // 2. Montar prompt para OpenAI
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

    // 3. Consulta IA (OpenAI)
    const resposta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const analise = resposta.choices[0].message.content;
    console.log("Análise da IA:", analise);

    // 4. (Opcional) Executar ações corretivas com base na análise da IA
    // Aqui você interpreta a resposta e, se necessário, fecha ordens, envia alertas, etc.

    // 5. Registrar auditoria
    await pool.query(
      `INSERT INTO audit_logs (evento, detalhes, status, payload)
       VALUES ($1, $2, $3, $4)`,
      [
        "análise_ia",
        analise,
        "sucesso",
        { ordens, contextoMercado }
      ]
    );

  } catch (e) {
    console.error("Erro no bot IA:", e);
    await pool.query(
      `INSERT INTO audit_logs (evento, detalhes, status)
       VALUES ($1, $2, $3)`,
      ["erro_bot_ia", e.message, "falha"]
    );
  }
}

// === Função para enviar alerta no WhatsApp a cada 4h ===
async function enviarAlertaWhatsAppCenario() {
  try {
    // Exemplo: Mensagem fictícia, personalize conforme sua necessidade
    const mensagem = "Leitura inteligente do cenário de mercado: [Resumo IA do momento]";
    await axios.post(
      WHATSAPP_API_URL,
      {
        phone: WHATSAPP_NUMBER,
        message: mensagem
      },
      {
        headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
      }
    );
    console.log("Alerta WhatsApp enviado.");
  } catch (e) {
    console.error("Erro ao enviar WhatsApp:", e.message);
  }
}

// === Agendamentos ===
cron.schedule("*/5 * * * *", monitorarOrdensEExecutarIA); // a cada 5 minutos
cron.schedule("0 */4 * * *", enviarAlertaWhatsAppCenario); // a cada 4 horas

// Para rodar local/teste
console.log("Bot IA CoinBitClub monitorando ordens e mercado...");
