/**
 * © 2025 CFH, All Rights Reserved
 * File: InspectionController.test.ts
 * Path: C:\CFH\backend\tests\controllers\inspection\InspectionController.test.ts
 * Purpose: Unit tests for the InspectionController.
 * Author: Mini Team, Cod1, Grok
 * Date: 2025-08-03 [02:31]
 * Version: 1.0.0
 * Version ID: b9c8d7e6-a5f4-g3h2-i1j0-k9l8m7n6o5p4
 * Crown Certified: Yes
 * Batch ID: Compliance-080325
 * Artifact ID: b9c8d7e6-a5f4-g3h2-i1j0-k9l8m7n6o5p4
 * Save Location: C:\CFH\backend\tests\controllers\inspection\InspectionController.test.ts
 */

import { getInspectionReportById, createInspectionJob } from '@controllers/InspectionController';
import { InspectionService } from '@services/InspectionService';
import { BadRequestError, ForbiddenError, NotFoundError } from '@utils/errors';

jest.mock('@services/InspectionService');

describe('InspectionController', () => {
    let req: any, res: any, next: any;
    let inspectionServiceMock: jest.Mocked<InspectionService>;

    beforeEach(() => {
        req = { user: { id: 'user123', role: 'user' }, params: {}, body: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
        
        inspectionServiceMock = new InspectionService() as jest.Mocked<InspectionService>;
        (InspectionService as jest.Mock).mockImplementation(() => inspectionServiceMock);
    });

    describe('getInspectionReportById', () => {
        it('should return a report when found', async () => {
            const mockReport = { _id: 'report123', findings: 'All good' };
            const reportId = '60d0fe4f5311236168a109ca'; // Use a valid ObjectId format
            req.params.reportId = reportId;
            inspectionServiceMock.getReportById.mockResolvedValue(mockReport as any);

            await getInspectionReportById(req, res, next);

            expect(inspectionServiceMock.getReportById).toHaveBeenCalledWith(reportId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockReport);
        });

        it('should call next with a NotFoundError if the service throws it', async () => {
            const notFoundError = new NotFoundError('Report not found');
            inspectionServiceMock.getReportById.mockRejectedValue(notFoundError);
            req.params.reportId = 'nonexistent';

            await getInspectionReportById(req, res, next);

            expect(next).toHaveBeenCalledWith(notFoundError);
        });
    });

    describe('createInspectionJob', () => {
        it('should deny access if user is not an admin', async () => {
            req.user.role = 'user'; // Non-admin role
            await createInspectionJob(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
        });

        it('should create a job when called by an admin', async () => {
            req.user.role = 'admin';
            req.body = { vehicle: 'car123', scheduledDate: new Date() };
            const mockSavedJob = { _id: 'job456', ...req.body };
            inspectionServiceMock.createJob.mockResolvedValue(mockSavedJob as any);

            await createInspectionJob(req, res, next);

            expect(inspectionServiceMock.createJob).toHaveBeenCalledWith({ ...req.body, createdBy: 'user123' });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockSavedJob);
        });
    });
});
