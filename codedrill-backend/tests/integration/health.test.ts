import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';

describe('Health and System Routes', () => {
  it('GET /api/v1 should return 200 and standard API welcome payload', async () => {
    const res = await request(app).get('/api/v1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('CodeDrill REST API');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /health/liveness should return 200 with UP status', async () => {
    const res = await request(app).get('/health/liveness');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('UP');
    expect(res.body.data.uptime).toBeGreaterThanOrEqual(0);
  });

  it('GET /api/v1/nonexistent should return 404 with standardized error envelope', async () => {
    const res = await request(app).get('/api/v1/nonexistent');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.timestamp).toBeDefined();
  });
});
