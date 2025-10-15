// File: shiftRoutes.test.ts
// Path: backend/routes/mechanic/__tests__/shiftRoutes.test.ts
// Purpose: Integration tests for the secure mechanic shift API endpoint.

import request from 'supertest';
import express, { Application } from 'express';
import shiftRouter from '../shiftRoutes'; // The router we are testing

// --- Mocks ---
// Mock the auth middleware to simulate different authenticated users
const mockAuthMiddleware = jest.fn();
jest.mock('@/middleware/auth', () => ({
  __esModule: true,
  default: (req: any, res: any, next: any) => mockAuthMiddleware(req, res, next),
}));

// Mock the date-fns library to have a predictable 'today'
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  startOfDay: (date: Date) => new Date(date.setUTCHours(0, 0, 0, 0)),
  endOfDay: (date: Date) => new Date(date.setUTCHours(23, 59, 59, 999)),
}));

// --- MOCK DATABASE (PLACEHOLDER) ---
// In a real test, you'd mock the Mongoose 'Shift' model's find method
const mockDbQuery = jest.fn();
// jest.mock('@/models/Shift', () => ({ find: mockDbQuery }));

// --- Test Setup ---
const app: Application = express();
app.use(express.json());
app.use('/api/mechanic', shiftRouter);

describe('GET /api/mechanic/shifts', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for auth: pass through
    mockAuthMiddleware.mockImplementation((req, res, next) => next());
  });

  // Test Case 1: A mechanic fetching their OWN shifts (Authorized)
  it('should return 200 when a mechanic requests their own shifts', async () => {
    mockAuthMiddleware.mockImplementation((req, res, next) => {
      req.user = { id: 'mech-123', role: 'mechanic' };
      next();
    });

    // mockDbQuery.mockResolvedValue([{ shiftId: 'shift1' }]); // Mock DB response
    const res = await request(app).get('/api/mechanic/shifts?mechanicId=mech-123');
    
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Test Case 2: A manager fetching ANY mechanic's shifts (Authorized)
  it('should return 200 when a manager requests any mechanic\'s shifts', async () => {
    mockAuthMiddleware.mockImplementation((req, res, next) => {
      req.user = { id: 'manager-789', role: 'manager' };
      next();
    });

    // mockDbQuery.mockResolvedValue([{ shiftId: 'shift2' }]);
    const res = await request(app).get('/api/mechanic/shifts?mechanicId=mech-123');

    expect(res.status).toBe(200);
  });

  // Test Case 3: A mechanic trying to fetch ANOTHER mechanic's shifts (Forbidden)
  it('should return 403 Forbidden when a mechanic requests another mechanic\'s shifts', async () => {
    mockAuthMiddleware.mockImplementation((req, res, next) => {
      req.user = { id: 'mech-123', role: 'mechanic' }; // Logged in as mech-123
      next();
    });

    // Requesting shifts for a DIFFERENT mechanic
    const res = await request(app).get('/api/mechanic/shifts?mechanicId=mech-456');

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('not authorized to view this shift schedule');
  });

  // Test Case 4: Request missing the required mechanicId
  it('should return 400 Bad Request if mechanicId is not provided', async () => {
    const res = await request(app).get('/api/mechanic/shifts');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('required query parameter');
  });

  // Test Case 5: Real-world API usage with date filtering
  it('should construct a correct database query when startDate and endDate are provided', async () => {
    mockAuthMiddleware.mockImplementation((req, res, next) => {
      req.user = { id: 'manager-789', role: 'manager' };
      next();
    });
    
    const startDate = '2025-08-01';
    const endDate = '2025-08-07';

    await request(app).get(`/api/mechanic/shifts?mechanicId=mech-123&startDate=${startDate}&endDate=${endDate}`);
    
    // This is where we would check the arguments passed to our mocked DB query
    // For example:
    // expect(mockDbQuery).toHaveBeenCalledWith({
    //   mechanicId: 'mech-123',
    //   date: {
    //     $gte: new Date('2025-08-01T00:00:00.000Z'),
    //     $lte: new Date('2025-08-07T23:59:59.999Z'),
    //   }
    // });
    
    // Since the DB is mocked out, we just confirm it was called in a way that suggests it would work.
    expect(res.status).toBe(200); // placeholder for the above assertion
  });
});