import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import env from './config/env.js';
import routes from './routes/index.js';
import noCacheSensitiveEndpoints from './middlewares/cacheControl.middleware.js';
import { apiLimiter } from './middlewares/rateLimiter.middleware.js';
import errorMiddleware from './core/middleware/errorMiddleware.js';
import notFound from './core/middleware/notFound.js';

const app: Express = express();

// 1. Strict CORS Whitelisting
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  process.env.CLIENT_URL,
  process.env.APP_URL
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile native apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS Error: Origin not allowed by Access-Control-Allow-Origin policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-XSRF-TOKEN', 'X-CSRF-TOKEN']
  })
);

// 2. Comprehensive Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'", "ws:", "wss:", "http://localhost:*", "http://127.0.0.1:*", "https:"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' }, // Anti-clickjacking
    hidePoweredBy: true, // Hide X-Powered-By: Express
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true, // X-Content-Type-Options: nosniff
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  })
);

// 3. Payload Compression & Body Parser Limits (Denial-of-Service prevention)
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Express 5 compatibility: Make req.query writable so mongoSanitize and hpp can sanitize query parameters
app.use((req, _res, next) => {
  if (req.query) {
    Object.defineProperty(req, 'query', {
      value: { ...req.query },
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
  next();
});

// 4. NoSQL Injection & Parameter Pollution Defense
app.use((mongoSanitize as any)({ replaceWith: '_' }));
app.use(hpp());

// 5. HTTP Logging
app.use(morgan('dev'));

// 6. API Routes with Global Rate Limiting and Cache Control
app.use(env.API_PREFIX, apiLimiter, noCacheSensitiveEndpoints, routes);

// 7. Error Handling
app.use(notFound);
app.use(errorMiddleware);

export default app;
