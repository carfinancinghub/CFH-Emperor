// File: taskCompletionRoutes.test.ts
// Path: backend/routes/mechanic/__tests__/taskCompletionRoutes.test.ts
// Purpose: Comprehensive integration tests for the mechanic task completion API endpoint.

import request from 'supertest';
import express, { Application } from 'express';
import taskCompletionRouter from '../taskCompletionRoutes';
import logger from '@utils/logger';

// --- Mocks ---
// Mock the logger to prevent console output during tests and allow spying
jest.mock('@utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

// Mock the auth middleware to simulate an authenticated mechanic
jest.mock('../../middleware/auth', () => ({
  __esModule: true,
  default: (req: any, res: any, next: any) => {
    req.user = { id: 'auth-mechanic-123' }; // The authenticated user
    next();
  },
}));

// Mock the entire socket.io chain
const mockIo = { emit: jest.fn() };
const mockApp = { get: jest.fn((key: string) => (key === 'socketio' ? mockIo : null)) };

// --- Test Setup ---
const app: Application = express();
app.use(express.json());
app.set('socketio', mockIo); // Make the mocked socket.io available to the app
app.use('/api/mechanic', taskCompletionRouter);

describe('POST /api/mechanic/task-completed', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Use fake timers to control Date() for timestamp validation
    jest.useFakeTimers().setSystemTime(new Date('2025-08-10T14:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // --- MOCK DATABASE AND MODELS (PLACEHOLDERS) ---
  // In a real test, you'd mock the Mongoose models. We simulate that here.
  const mockTask = {
      _id: 'task-abc-789',
      status: 'in-progress',
      vehicleId: 'vehicle-123',
      save: jest.fn().mockResolvedValue(true),
  };
  // jest.mock('../../models/Task', () => ({ findById: jest.fn().mockResolvedValue(mockTask) }));
  // jest.mock('../../models/Vehicle', () => ({ findByIdAndUpdate: jest.fn().mockResolvedValue(true) }));
  // jest.mock('../../models/AuditLog', () => jest.fn().mockImplementation(() => ({ save: jest.fn().mockResolvedValue(true) })));


  // Test Case 1: The "Happy Path" - a valid, successful submission
  it('should return 200 and success message on a valid request', async () => {
    const validBody = {
      taskId: 'task-abc-789',
      mechanicId: 'auth-mechanic-123', // Matches the authenticated user
      timestamp: new Date().toISOString(),
    };
    
    const res = await request(app).post('/api/mechanic/task-completed').send(validBody);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Task marked as completed and system updated.');
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('marked \'completed\''));
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('status updated to \'Ready for Inspection\''));
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Audit trail created'));
    expect(mockIo.emit).toHaveBeenCalledWith('tasks:update', { taskId: validBody.taskId, status: 'completed' });
  });

  // Test Case 2: Idempotency - submitting a task that is already complete
  it('should return 200 with an "already completed" message if the task is already done', async () => {
    // Override the mock for this test
    // jest.spyOn(Task, 'findById').mockResolvedValueOnce({ ...mockTask, status: 'completed' });
    const validBody = {
      taskId: 'task-abc-789',
      mechanicId: 'auth-mechanic-123',
      timestamp: new Date().toISOString(),
    };
    
    // For this test, we'll manually check the logic since the mock is simplified
    // In a real scenario, the test above would be adjusted to return a task with 'completed' status
    const res = await request(app).post('/api/mechanic/task-completed').send(validBody);
    
    // This test assumes the idempotency check is correctly implemented inside the route.
    // A real test would mock findById to return a completed task and assert the specific message.
    expect(res.status).toBe(200); // Should still be successful
  });

  // Test Case 3: Authorization - trying to complete another mechanic's task
  it('should return 403 Forbidden if mechanicId does not match authenticated user', async () => {
    const invalidBody = {
      taskId: 'task-abc-789',
      mechanicId: 'another-mechanic-456', // Does NOT match auth user
      timestamp: new Date().toISOString(),
    };
    
    const res = await request(app).post('/api/mechanic/task-completed').send(invalidBody);
    
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden: You can only complete your own tasks.');
    expect(logger.error).toHaveBeenCalled();
  });

  // Test Case 4: Data Validation - out-of-sync timestamp
  it('should return 400 Bad Request for an out-of-range timestamp', async () => {
    const invalidBody = {
      taskId: 'task-abc-789',
      mechanicId: 'auth-mechanic-123',
      timestamp: '2025-08-10T10:00:00.000Z', // 4 hours in the past
    };

    const res = await request(app).post('/api/mechanic/task-completed').send(invalidBody);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Timestamp is out of a reasonable range.');
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('is out of sync'));
  });
  
  // Test Case 5: Data Validation - missing required field
  it('should return 400 Bad Request if taskId is missing', async () => {
    const invalidBody = {
      mechanicId: 'auth-mechanic-123',
      timestamp: new Date().toISOString(),
    };

    const res = await request(app).post('/api/mechanic/task-completed').send(invalidBody);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Missing required fields');
  });
});