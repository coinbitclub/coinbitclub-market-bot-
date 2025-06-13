import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => 
      `${timestamp} [${level.toUpperCase()}] ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    // …any file‐rotating transport you have
  ]
});
