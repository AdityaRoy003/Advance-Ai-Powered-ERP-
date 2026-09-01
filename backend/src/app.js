import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import env from './config/env.js';
import routes from './routes/index.js';
import errorMiddleware from './core/middleware/errorMiddleware.js';
import notFound from './core/middleware/notFound.js';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use(env.API_PREFIX, routes);

app.use(notFound);
app.use(errorMiddleware);

export default app;