import { getClientBySoftrId } from './databaseService.js';

export default async function verifySubscription(req, res, next) {
  const softrId = req.body.softr_client_id;
  if (!softrId) return res.status(400).json({ error: 'softr_client_id missing' });

  const client = await getClientBySoftrId(softrId);
  if (!client) return res.status(403).json({ error: 'Subscription inactive or client not found' });

  req.client = client;
  next();
}
