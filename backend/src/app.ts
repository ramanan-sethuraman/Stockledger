import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.routes.js';
import { benchmarkRouter } from './routes/benchmark.routes.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/reports/benchmark', benchmarkRouter);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'FactoryFlow ERP / Stockledger Core API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Fallback error handler
app.use(errorHandler);

export default app;
