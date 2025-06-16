import express from 'express';
import { saveSignal } from '../services/signalsService.js';

const router = express.Router();

router.get('/signal', async (req, res) => {
    try {
        // Se vier dados via query string, transforma para objeto sinal
        const data = req.query || {};
        if (Object.keys(data).length > 0) {
            await saveSignal(data);
            return res.json({ msg: 'GET /webhook/signal salvo no banco', body: data });
        }
        res.json({ msg: 'GET /webhook/signal funcionando' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar signal via GET' });
    }
});
