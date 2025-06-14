import winston from 'winston';

export const logger = winston.createlogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ],
});
