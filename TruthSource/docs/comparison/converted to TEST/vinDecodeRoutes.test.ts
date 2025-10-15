/*
 * File: vinDecodeRoutes.test.ts
 * Path: C:\CFH\backend\tests\routes\mechanic\vinDecodeRoutes.test.ts
 * Created: 2025-07-25 17:00 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the VIN decode API route.
 * Artifact ID: test-route-vin-decode
 * Version ID: test-route-vin-decode-v1.0.0
 */

import request from 'supertest';
import express from 'express';
import vinDecodeRouter from '@routes/mechanic/vinDecodeRoutes';

const app = express();
app.use('/api/mechanic', vinDecodeRouter);

describe('VIN Decode API Route', () => {
  it('should return decoded data for a valid VIN', async () => {
    const vin = '1234567890ABCDEFG';
    const res = await request(app).get(`/api/mechanic/vin/${vin}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      vin,
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
    });
  });

  it('should return a 400 error for a short or invalid VIN', async () => {
    const res = await request(app).get('/api/mechanic/vin/short');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Invalid VIN provided');
  });
});
