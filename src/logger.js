import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

export const logger = createLogger({
level: 'info',
format: format.combine(format.timestamp(), format.printf(({ level, message, timestamp }) => ${timestamp} [${level.toUpperCase()}] ${message})),
transports: [
new transports.Console(),
new transports.DailyRotateFile({ dirname: 'logs', filename: 'app-%DATE%.log', datePattern: 'YYYY-MM-DD', maxFiles: '14d' })
]
});
