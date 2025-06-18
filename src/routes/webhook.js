cat > src/routes/webhook.js << 'EOF'
import express from 'express';
import { parseSignal } from '../services/parseSignal.js';
import { saveSignal }  from '../services/signalsService.js';
import { parseDominance } from '../services/parseDominance.js';
import { saveDominance }  from '../services/dominanceService.js';

const router = express.Router();

// POST /webhook/signal
router.post('/signal', async (req, res) => {
  try {
    const sig = parseSignal(req.body);
    await saveSignal(sig);
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('[webhook/signal]', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /webhook/dominance
router.post('/dominance', async (req, res) => {
  try {
    const dom = parseDominance(req.body);
    await saveDominance(dom);
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('[webhook/dominance]', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
EOF
