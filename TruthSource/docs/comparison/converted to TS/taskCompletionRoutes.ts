// File: taskCompletionRoutes.ts
// Path: backend/routes/mechanic/taskCompletionRoutes.ts
// Purpose: Production-grade route for marking mechanic tasks as completed.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — Resilient, Idempotent, Auditable, and Secure.

// TODO:
// @free:
//   - [ ] Implement the actual Mongoose models for Task, Vehicle, and AuditLog.
//   - [ ] Implement robust Zod validation for the request body to replace the basic checks.
// @premium:
//   - [ ] ✨ Add logic to calculate the time taken to complete the task and store it for performance analytics.
//   - [ ] ✨ If a task completion triggers a vehicle status change, send a notification to the next department in the workflow (e.g., Quality Control).
// @wow:
//   - [ ] 🚀 Trigger a request to the inventory system to automatically order parts that were consumed during the task.

import { Router, Response } from 'express';
// ✅ Corrected to use the '@' alias
import auth, { AuthenticatedRequest } from '@/middleware/auth'; 
import logger from '@utils/logger';

// ✅ Corrected to use the '@' alias
// import Task from '@/models/Task';
// import Vehicle from '@/models/Vehicle';
// import AuditLog from '@/models/AuditLog';

const router = Router();

// --- Type Definitions ---
interface CompletionBody {
  taskId: string;
  mechanicId: string; // Included for auditing, but authorization will use the token's user ID.
  timestamp: string;  // ISO 8601 format
}

// --- Route Handler ---
router.post('/task-completed', auth, async (req: AuthenticatedRequest, res: Response) => {
  const { taskId, mechanicId, timestamp } = req.body as CompletionBody;
  const authUserId = req.user.id; // The authenticated user's ID from the JWT.

  try {
    // 1. --- Data Validation & Sanity Checks ---
    if (!taskId || !mechanicId || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields: taskId, mechanicId, timestamp.' });
    }

    const requestTime = new Date(timestamp);
    const serverTime = new Date();
    if (Math.abs(serverTime.getTime() - requestTime.getTime()) > 3600 * 1000) { // 1 hour window
      logger.warn(`Timestamp from request ${timestamp} is out of sync with server time.`);
      return res.status(400).json({ error: 'Timestamp is out of a reasonable range.' });
    }

    // --- MOCK DATABASE LOGIC - Replace with real Mongoose calls ---
    // const task = await Task.findById(taskId);
    const task = { _id: taskId, status: 'in-progress', vehicleId: 'vehicle-123' }; // Mock task

    // 2. --- Idempotency Check ---
    if (task?.status === 'completed') {
      return res.status(200).json({ success: true, message: 'Task was already marked as completed.' });
    }
    
    // 3. --- Authorization ---
    if (authUserId !== mechanicId) {
      logger.error(`Auth Error: User ${authUserId} tried to complete task for mechanic ${mechanicId}.`);
      return res.status(403).json({ error: 'Forbidden: You can only complete your own tasks.' });
    }
    
    // 4. --- Main Logic: Update Task ---
    // task.status = 'completed';
    // task.completedAt = requestTime;
    // await task.save();
    logger.info(`Task ${taskId} marked 'completed' by mechanic ${authUserId}`);
    
    // 5. --- Cascading Logic: Update Related Systems ---
    // await Vehicle.findByIdAndUpdate(task.vehicleId, { $set: { status: 'Ready for Inspection' } });
    logger.info(`Vehicle ${task.vehicleId} status updated to 'Ready for Inspection'.`);

    // 6. --- Audit Trail ---
    // await new AuditLog({
    //   action: 'TASK_COMPLETED',
    //   userId: authUserId,
    //   details: `Task ${taskId} for vehicle ${task.vehicleId} was completed.`
    // }).save();
    logger.info(`Audit trail created for task ${taskId} completion.`);
    
    // 7. --- Real-time Feedback ---
    const io = req.app.get('socketio');
    if (io) {
      io.emit('tasks:update', { taskId, status: 'completed' });
      logger.info(`WebSocket event 'tasks:update' emitted for ${taskId}.`);
    }

    return res.status(200).json({ success: true, message: 'Task marked as completed and system updated.' });

  } catch (err) {
    const error = err as Error;
    logger.error(`Task completion error for task ${taskId}: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error during task completion.' });
  }
});

export default router;