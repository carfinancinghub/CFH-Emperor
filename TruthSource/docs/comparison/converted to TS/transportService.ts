// ----------------------------------------------------------------------
// File: transportService.ts
// Path: backend/src/services/transportService.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A unified service for managing the entire transport job lifecycle,
// from assignment to delivery.
//
// @architectural_notes
// - **Single Responsibility**: This service's only job is to manage the
//   business logic for transport jobs. It is decoupled from the API routes.
// - **Ironclad Authorization**: Every function includes a critical authorization
//   check to ensure a hauler can only access or modify their own jobs.
//
// @todos
// - @free:
//   - [ ] Implement the actual Mongoose model for 'Transport'.
// - @premium:
//   - [ ] ✨ Integrate with a mapping service to provide real-time ETA calculations for deliveries.
// - @wow:
//   - [ ] 🚀 Develop a "Smart Route" feature that suggests the most efficient route for haulers with multiple pickups.
//
// ----------------------------------------------------------------------

import Transport from '@/models/Transport';
import { IUser, ITransport } from '@/types';
import logger from '@/utils/logger';

const transportService = {
  /**
   * Fetches all jobs assigned to a specific hauler.
   */
  async getHaulerJobs(user: IUser): Promise<ITransport[]> {
    return Transport.find({ haulerId: user.id });
  },

  /**
   * Updates the current location for a specific job.
   */
  async updateJobLocation(user: IUser, jobId: string, location: object): Promise<ITransport> {
    const job = await Transport.findById(jobId);
    if (!job) throw new Error('Transport job not found');
    
    // Authorization Check
    if (job.haulerId.toString() !== user.id) {
      throw new Error('Forbidden: Not authorized to update this job.');
    }

    job.currentLocation = location;
    await job.save();
    
    logger.info(`Updated location for job ${jobId} by hauler ${user.id}`);
    return job;
  },
};

export default transportService;