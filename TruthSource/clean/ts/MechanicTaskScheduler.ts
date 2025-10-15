// Converted from MechanicTaskScheduler.js — 2025-08-22T01:45:32.602352+00:00
// File: MechanicTaskScheduler.js
// Path: backend/controllers/mechanic/MechanicTaskScheduler.js
// Author: Cod1 (05061259)
// Description: Assigns and tracks mechanic tasks for inspections

const assignTask = async (req, res) => {
  try {
    const { vehicleId, mechanicId, dueDate } = req.body;
    if (!vehicleId || !mechanicId) {
      return res.status(400).json({ message: 'Missing required task parameters.' });
    }

    const task = {
      taskId: `TASK-${Date.now()}`,
      vehicleId,
      mechanicId,
      assignedAt: new Date(),
      dueDate: dueDate || new Date(Date.now() + 86400000),
    };

    return res.status(200).json({ message: 'Task scheduled.', task });
  } catch (err) {
    console.error('Task scheduling failed:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { assignTask };
