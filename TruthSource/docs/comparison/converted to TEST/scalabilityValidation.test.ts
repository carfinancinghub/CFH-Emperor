// File: scalabilityValidation.test.ts
// Path: backend/scripts/__tests__/scalabilityValidation.test.ts
// Purpose: Tests the automated scalability validation script for CI/CD integration.

import fs from 'fs/promises';
import { runValidation } from '../scalabilityValidation'; // Assuming runValidation is exported

// --- Mocks ---
// Mock the core logic function to test the main script runner
const mockValidateScalabilityReport = jest.fn();
jest.mock('../scalabilityValidation', () => ({
    ...jest.requireActual('../scalabilityValidation'),
    validateScalabilityReport: () => mockValidateScalabilityReport(),
}));

// Mock file system and process.exit
jest.mock('fs/promises', () => ({ writeFile: jest.fn() }));
const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {}) as (code?: number) => never);
jest.mock('@utils/logger', () => ({ info: jest.fn(), error: jest.fn() }));


describe('Scalability Validation Script', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should exit with code 0 if validation passes', async () => {
        mockValidateScalabilityReport.mockReturnValue({ isValid: true, report: { status: 'PASSED' } });

        await runValidation();

        expect(fs.writeFile).toHaveBeenCalled();
        expect(mockExit).toHaveBeenCalledWith(0);
    });

    it('should exit with code 1 if validation fails', async () => {
        mockValidateScalabilityReport.mockReturnValue({ isValid: false, report: { status: 'FAILED' } });
        
        await runValidation();

        expect(fs.writeFile).toHaveBeenCalled();
        expect(mockExit).toHaveBeenCalledWith(1);
    });
    
    it('should exit with code 1 if an unexpected error occurs', async () => {
        const error = new Error('Failed to read report file');
        mockValidateScalabilityReport.mockImplementation(() => { throw error; });

        await runValidation();

        expect(mockExit).toHaveBeenCalledWith(1);
    });
});