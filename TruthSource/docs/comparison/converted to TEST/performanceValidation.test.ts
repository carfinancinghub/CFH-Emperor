// ----------------------------------------------------------------------
// File: performanceValidation.test.ts
// Path: backend/scripts/__tests__/performanceValidation.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:14 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { runValidation } from '../performanceValidation';

const mockValidate = jest.fn();
jest.mock('../performanceValidation', () => ({ ...jest.requireActual('../performanceValidation'), validatePerformanceReport: () => mockValidate() }));
jest.mock('fs/promises', () => ({ writeFile: jest.fn() }));
const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);

describe('Performance Validation Script', () => {
  it('should exit with code 1 if validation fails', async () => {
    mockValidate.mockReturnValue({ validationIssues: ['Failed'] });
    await runValidation();
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});