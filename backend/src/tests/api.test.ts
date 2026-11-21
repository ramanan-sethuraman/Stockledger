import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('FactoryFlow ERP API Test Suite', () => {
  it('GET /api/v1/health returns online status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ONLINE');
    expect(res.body.service).toContain('FactoryFlow ERP');
  });

  it('POST /api/v1/auth/login succeeds with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@factoryflow.in', password: 'Password@123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('ADMIN');
  });

  it('POST /api/v1/auth/login rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@factoryflow.in', password: 'WrongPassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/reports/benchmark/run executes full 15-step benchmark and passes 100%', async () => {
    const res = await request(app).get('/api/v1/reports/benchmark/run');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('VERIFIED_100_PERCENT');
    expect(res.body.data.criteria).toHaveLength(15);

    // Verify all 15 criteria passed
    for (const criterion of res.body.data.criteria) {
      expect(criterion.passed).toBe(true);
    }

    // Verify key financial figures
    expect(res.body.data.costingSummary.totalBatchCost).toBe(5855);
    expect(res.body.data.costingSummary.costPerGoodPacket).toBeCloseTo(31.1436, 4);
    expect(res.body.data.costingSummary.grossMarginPercent).toBeCloseTo(37.71, 1);
  });
});
