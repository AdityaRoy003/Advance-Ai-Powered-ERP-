import fs from 'fs';
import path from 'path';

const logsDir = path.resolve(process.cwd(), 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = (fileName: string): string => path.join(logsDir, fileName);

const writeLog = (fileName: string, level: string, message: string): void => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile(fileName), `[${timestamp}] [${level}] ${message}\n`, 'utf8');
};

const logger = {
  info: (message: string): void => writeLog('access.log', 'INFO', message),
  error: (message: string): void => writeLog('error.log', 'ERROR', message),
  warn: (message: string): void => writeLog('security.log', 'WARN', message),
  audit: (message: string): void => writeLog('audit.log', 'AUDIT', message),
  ai: (message: string): void => writeLog('ai.log', 'AI', message)
};

export default logger;
