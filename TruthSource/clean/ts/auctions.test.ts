/**
 * � 2025 CFH, All Rights Reserved
 * Purpose: Tests for auction routes in the CFH Automotive Ecosystem
 * Author: CFH Dev Team
 * Date: 2025-06-23T20:15:00.000Z
 * Version: 1.0.4
 * Crown Certified: Yes
 * Batch ID: Tests-062325
 * Save Location: C:\CFH\backend\tests\auctions\auctions.test.ts
 */
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '@root/app';
describe('Auction Routes', () => {
    const auctionId = '12345';
    const invalidAuctionId = 'invalid';
    let token;
    beforeAll(() => {
        token = jwt.sign({ id: 'test-user-id', role: 'user' }, 'test-secret', { expiresIn: '1h' });
    });
    it('GET /api/auctions/:auctionId returns auction item for valid ID', async () => {
        const res = await request(app)
            .get(/api/auctions / )
            .set('Authorization', Bearer);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', auctionId);
        expect(res.body).toHaveProperty('title', 'Test Auction');
    });
    it('GET /api/auctions/:auctionId returns 404 for invalid ID', async () => {
        const res = await request(app)
            .get(/api/auctions / )
            .set('Authorization', Bearer);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Auction not found');
    });
    it('POST /api/auctions/:auctionId/bids with invalid bid returns 400', async () => {
        const res = await request(app)
            .post(/api/auctions //bids)
            .set('Authorization', Bearer)
            .send({ amount: -100 }));
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid bid amount');
    });
    it('POST /api/auctions/:auctionId/bids with valid bid returns 201', async () => {
        const res = await request(app)
            .post(/api/auctions //bids)
            .set('Authorization', Bearer)
            .send({ amount: 1000 }));
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Bid placed successfully');
        expect(res.body.bid).toHaveProperty('amount', 1000);
    });
    it('POST /api/auctions/:auctionId/bids returns 404 for invalid auction ID', async () => {
        const res = await request(app)
            .post(/api/auctions //bids)
            .set('Authorization', Bearer)
            .send({ amount: 1000 }));
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Auction not found');
    });
});
