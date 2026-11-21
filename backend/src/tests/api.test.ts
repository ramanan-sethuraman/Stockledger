import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Stockledger Comprehensive API Test Suite', () => {
  it('GET /api/v1/health returns online status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ONLINE');
    expect(res.body.service).toContain('Stockledger');
  });

  it('POST /api/v1/auth/login succeeds with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@stockledger.in', password: 'Password@123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('ADMIN');
  });

  it('POST /api/v1/auth/login rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@stockledger.in', password: 'WrongPassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/materials returns accurate stock and weighted rates', async () => {
    const res = await request(app).get('/api/v1/materials');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(5);

    const flour = res.body.data.find((m: any) => m.code === 'RM-FLOUR');
    expect(flour.currentStock).toBe(120);
    expect(flour.currentWeightedRate).toBe(43.125);

    const oil = res.body.data.find((m: any) => m.code === 'RM-OIL');
    expect(oil.currentStock).toBe(19.5);

    const pouches = res.body.data.find((m: any) => m.code === 'PM-POUCH');
    expect(pouches.currentStock).toBe(306);
  });

  it('GET /api/v1/products returns Murukku 200g with HSN 1905', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].sku).toBe('MUR-200G');
    expect(res.body.data[0].hsnCode).toBe('1905');
    expect(res.body.data[0].sellingPrice).toBe(50.0);
    expect(res.body.data[0].currentStock).toBe(88);
  });

  it('GET /api/v1/production/batches returns batch with -6% yield variance and +5% oil variance', async () => {
    const res = await request(app).get('/api/v1/production/batches');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const batch = res.body.data[0];
    expect(batch.plannedYield).toBe(200);
    expect(batch.goodOutput).toBe(188);
    expect(batch.yieldVariancePercent).toBe(-6.0);
    expect(batch.costing.totalBatchCost).toBe(5855.0);
    expect(batch.costing.costPerGoodPacket).toBeCloseTo(31.1436, 4);
    expect(batch.costing.grossMarginPercent).toBeCloseTo(37.71, 1);
  });

  it('GET /api/v1/sales/orders identifies shortage of 32 packets on SO-002', async () => {
    const res = await request(app).get('/api/v1/sales/orders');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);

    const so2 = res.body.data.find((o: any) => o.orderNumber.includes('002'));
    expect(so2.status).toBe('SHORTAGE_EXCEPTION');
    expect(so2.shortageQty).toBe(32);
    expect(so2.availableStock).toBe(88);
  });

  it('GET /api/v1/invoices returns statutory GST invoice with CGST/SGST split and partial payment balance', async () => {
    const res = await request(app).get('/api/v1/invoices');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const inv = res.body.data[0];
    expect(inv.taxableValue).toBe(7500.0);
    expect(inv.cgstAmount).toBe(187.50);
    expect(inv.sgstAmount).toBe(187.50);
    expect(inv.totalInvoiceAmount).toBe(7875.0);
    expect(inv.paidAmount).toBe(4000.0);
    expect(inv.balanceAmount).toBe(3875.0);
  });

  it('GET /api/v1/inventory/ledger returns double-entry ledger trace', async () => {
    const res = await request(app).get('/api/v1/inventory/ledger');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(9);
  });

  it('GET /api/v1/dashboard/metrics returns real-time aggregated metrics', async () => {
    const res = await request(app).get('/api/v1/dashboard/metrics');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalReceivables).toBe(3875.0);
    expect(res.body.data.finishedGoodsStock).toBe(88);
    expect(res.body.data.benchmarkPassed).toBe(true);
  });

  it('GET /api/v1/reports/benchmark/run executes full 15-step benchmark and passes 100%', async () => {
    const res = await request(app).get('/api/v1/reports/benchmark/run');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('VERIFIED_100_PERCENT');
    expect(res.body.data.criteria).toHaveLength(15);

    for (const criterion of res.body.data.criteria) {
      expect(criterion.passed).toBe(true);
    }
  });
});
