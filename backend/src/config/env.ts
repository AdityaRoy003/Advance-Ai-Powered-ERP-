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

const isProduction = (process.env.NODE_ENV || '').toLowerCase() === 'production';
const jwtSecret = process.env.JWT_SECRET || 'eduverse-dev-secure-jwt-secret-key-2026-min32chars';

if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-secret' || process.env.JWT_SECRET.length < 32)) {
  console.warn('⚠️  CRITICAL SECURITY WARNING: In production, JWT_SECRET must be set to a high-entropy string of at least 32 characters.');
}

const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: jwtSecret,
  APP_NAME: process.env.APP_NAME || 'EduVerse AI ERP',
  API_PREFIX: process.env.API_PREFIX || '/api'
};

export default env;
