import fs from 'fs';
import path from 'path';

const logsDir = path.resolve(process.cwd(), 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = (fileName) => path.join(logsDir, fileName);

const writeLog = (fileName, level, message) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile(fileName), `[${timestamp}] [${level}] ${message}\n`, 'utf8');
};

const logger = {
  info: (message) => writeLog('access.log', 'INFO', message),
  error: (message) => writeLog('error.log', 'ERROR', message),
  warn: (message) => writeLog('security.log', 'WARN', message),
  audit: (message) => writeLog('audit.log', 'AUDIT', message),
  ai: (message) => writeLog('ai.log', 'AI', message)
};

export default logger;
