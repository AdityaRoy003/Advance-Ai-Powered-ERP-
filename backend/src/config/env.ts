import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  APP_NAME: string;
  API_PREFIX: string;
}

const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
  APP_NAME: process.env.APP_NAME || 'EduVerse AI ERP',
  API_PREFIX: process.env.API_PREFIX || '/api'
};

export default env;
