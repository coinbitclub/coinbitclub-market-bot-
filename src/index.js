import express from 'express';
import webhookRouter from './routes/webhook.js';
import { logger } from './logger.js';
const app=express();
app.use(express.json());app.use(express.urlencoded({extended:true}));
app.get('/health',(r,s)=>s.send('OK'));
app.use('/webhook',webhookRouter);
app.use((e,r,s,n)=>{logger.error('Unhandled',e);s.status(500).json({error:'Erro interno'});});
export default app;
