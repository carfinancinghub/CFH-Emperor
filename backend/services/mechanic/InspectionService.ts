/**
 * © 2025 CFH, All Rights Reserved
 * File: InspectionService.ts
 * Path: C:\CFH\backend\services\mechanic\InspectionService.ts
 * Purpose: Handles the business logic for creating, retrieving, and managing inspection jobs and reports.
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-08-03 [02:31]
 * Version: 1.0.0
 * Version ID: a8b7c6d5-e4f3-g2h1-i0j9-k8l7m6n5o4p3
 * Crown Certified: Yes
 * Batch ID: Compliance-080325
 * Artifact ID: a8b7c6d5-e4f3-g2h1-i0j9-k8l7m6n5o4p3
 * Save Location: C:\CFH\backend\services\mechanic\InspectionService.ts
 */

import Inspection, { IInspection } from '@models/Inspection';
import User from '@models/User';
import Car from '@models/Car';
import { NotFoundError, ForbiddenError } from '@utils/errors';

export class InspectionService {
    public async getReportById(reportId: string): Promise<IInspection> {
        const report = await Inspection.findById(reportId).populate('mechanic vehicle buyer').lean();
        if (!report) {
            throw new NotFoundError('Inspection report not found');
        }
        return report;
    }

    public async getJobsForMechanic(mechanicId: string): Promise<IInspection[]> {
        const mechanicExists = await User.findById(mechanicId);
        if (!mechanicExists) {
            throw new NotFoundError('Mechanic not found');
        }
        return Inspection.find({ mechanic: mechanicId }).populate('vehicle').lean();
    }

    public async createJob(data: { vehicle: string; scheduledDate: Date; assignedTo?: string; createdBy: string }): Promise<IInspection> {
        const { vehicle, scheduledDate, assignedTo, createdBy } = data;
        const [vehicleExists, mechanicExists] = await Promise.all([
            Car.findById(vehicle),
            assignedTo ? User.findById(assignedTo) : Promise.resolve(null),
        ]);

        if (!vehicleExists) throw new NotFoundError('Vehicle not found');
        if (assignedTo && !mechanicExists) throw new NotFoundError('Assigned mechanic not found');

        const newJob = new Inspection({
            vehicle,
            scheduledDate,
            mechanic: assignedTo || createdBy,
        });
        return newJob.save();
    }

    public async submitReport(jobId: string, userId: string, reportData: any): Promise<IInspection> {
        const job = await Inspection.findById(jobId);
        if (!job) {
            throw new NotFoundError('Inspection job not found');
        }
        if (job.mechanic.toString() !== userId) {
            throw new ForbiddenError('User is not authorized to submit this report');
        }

        const { condition, notes, issuesFound, photoUrls, voiceNotes } = reportData;
        job.condition = condition;
        job.notes = notes;
        job.issuesFound = issuesFound || [];
        job.photoUrls = photoUrls || [];
        job.voiceNotes = voiceNotes || [];
        job.completedAt = new Date();
        job.status = 'Completed';

        return job.save();
    }

    public async getAllReports(): Promise<IInspection[]> {
        return Inspection.find().populate('vehicle mechanic buyer').lean();
    }
}
