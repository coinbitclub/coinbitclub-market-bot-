import { parseDominance, saveDominance } from './services/coinstatsService.js';

router.post('/dominance', async (req, res, next) => {
  try {
    const dom = parseDominance(req.body);
    await saveDominance(dom);
    res.status(200).send('Dominance received');
  } catch (err) {
    logger.error(err.stack||err);
    next(err);
  }
});
