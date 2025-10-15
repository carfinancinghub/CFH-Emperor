// File: taskOutcomeRoutes.test.ts
// Path: backend/routes/mechanic/__tests__/taskOutcomeRoutes.test.ts
// Purpose: Tests the mechanic task outcome reporting API endpoint.

import request from 'supertest';
import express, { Application } from 'express';
import taskOutcomeRouter from '../taskOutcomeRoutes'; // The router we are testing

// --- Mocks ---
// Mock the auth middleware to simulate an authenticated user
jest.mock('../../middleware/auth', () => ({
    __esModule: true,
    default: (req: any, res: any, next: any) => {
      req.user = { id: 'mechanic-user-123' }; // Provide a mock user ID
      next();
    }
}));

// --- Test Setup ---
const app: Application = express();
app.use(express.json());
// Mount the router under a specific path for testing
app.use('/api/mechanic', taskOutcomeRouter);

describe('POST /api/mechanic/tasks/report', () => {

  // Test Case 1: Successful submission with all required data
  it('should return 200 and a success message for a valid report', async () => {
    const reportData = {
      taskId: 'task-abc-123',
      status: 'successful',
      notes: 'All checks passed. Vehicle is ready.',
    };

    const res = await request(app)
      .post('/api/mechanic/tasks/report')
      .send(reportData);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task outcome submitted successfully');
    expect(res.body.taskOutcome).toBeDefined();
    expect(res.body.taskOutcome.taskId).toBe(reportData.taskId);
    expect(res.body.taskOutcome.reportedBy).toBe('mechanic-user-123'); // Verify auth middleware worked
  });

  // Test Case 2: Submission missing the 'status' field
  it('should return 400 if the status field is missing', async () => {
    const reportData = {
      taskId: 'task-abc-123',
      notes: 'Forgot to add status.',
    };

    const res = await request(app)
      .post('/api/mechanic/tasks/report')
      .send(reportData);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('taskId and status are required.');
  });
  
  // Test Case 3: Submission missing the 'taskId' field
  it('should return 400 if the taskId field is missing', async () => {
    const reportData = {
      status: 'failed',
      notes: 'Cannot identify the task.',
    };

    const res = await request(app)
      .post('/api/mechanic/tasks/report')
      .send(reportData);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('taskId and status are required.');
  });
  
  // Test Case 4: Successful submission with only required fields
  it('should return 200 even if optional "notes" field is missing', async () => {
    const reportData = {
      taskId: 'task-xyz-789',
      status: 'partial',
    };

    const res = await request(app)
      .post('/api/mechanic/tasks/report')
      .send(reportData);

    expect(res.status).toBe(200);
    expect(res.body.taskOutcome).toBeDefined();
    expect(res.body.taskOutcome.notes).toBe('No notes provided.');
  });
});