import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.routes.js';
import { benchmarkRouter } from './routes/benchmark.routes.js';
import { materialRouter } from './routes/material.routes.js';
import { productRouter } from './routes/product.routes.js';
import { productionRouter } from './routes/production.routes.js';
import { salesRouter } from './routes/sales.routes.js';
import { invoiceRouter } from './routes/invoice.routes.js';
import { inventoryRouter } from './routes/inventory.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Core Domain REST Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/reports/benchmark', benchmarkRouter);
app.use('/api/v1/materials', materialRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/production', productionRouter);
app.use('/api/v1/sales', salesRouter);
app.use('/api/v1/invoices', invoiceRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/dashboard', dashboardRouter);

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
