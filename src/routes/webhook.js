import express from 'express';
const router = express.Router();

// Handler para GET /webhook/signal
router.get('/signal', (req, res) => {
  res.status(200).json({ status: "ok", msg: "GET recebido com sucesso!" });
});

// Handler para POST /webhook/signal
router.post('/signal', async (req, res) => {
  try {
    let { time, ...rest } = req.body;

    // Aceita timestamp em milissegundos, ISO string, ou formato "YYYY-MM-DD HH:mm:ss"
    if (!time) {
      return res.status(400).json({ error: "Campo 'time' é obrigatório" });
    }

    let parsedTime;
    if (typeof time === "number") {
      // Se vier timestamp em milissegundos
      parsedTime = new Date(time).toISOString();
    } else if (typeof time === "string") {
      // Se vier ISO ou outro formato, tenta converter
      parsedTime = new Date(time).toISOString();
      if (parsedTime === "Invalid Date") {
        // Tenta substituir espaço por T
        parsedTime = new Date(time.replace(' ', 'T')).toISOString();
      }
      if (parsedTime === "Invalid Date") {
        return res.status(400).json({ error: "Formato de 'time' inválido" });
      }
    } else {
      return res.status(400).json({ error: "Formato de 'time' não suportado" });
    }

    // Monta o objeto com o time corrigido
    const fixedSignal = { ...rest, time: parsedTime };

    // 👉 Aqui você deve chamar sua função real de salvar sinal:
    // await saveSignal(fixedSignal);

    res.json({ status: "ok", signal: fixedSignal });
  } catch (err) {
    console.error('[ERROR] Signal POST:', err);
    res.status(500).json({ error: 'Erro ao processar sinal' });
  }
});

export default router;
