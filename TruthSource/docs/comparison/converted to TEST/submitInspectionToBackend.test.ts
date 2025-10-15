// File: submitInspectionToBackend.test.ts
// Path: frontend/src/utils/inspection/__tests__/submitInspectionToBackend.test.ts
// Purpose: Tests the type-safe utility for submitting inspection data.

import axios from 'axios';
import { submitInspection } from '../submitInspectionToBackend';

// --- Mocks ---
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('submitInspection utility function', () => {
  const token = 'test-jwt-token';
  const jobId = 'job-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call axios.post with correct FormData when a photo is provided', async () => {
    const mockPhoto = new File(['(⌐□_□)'], 'selfie.png', { type: 'image/png' });
    const inspectionData = { notes: 'All clear', photo: mockPhoto };
    
    mockedAxios.post.mockResolvedValue({ data: { success: true } });

    await submitInspection(jobId, inspectionData, token);

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    
    // Check the arguments passed to axios.post
    const [url, formData, config] = mockedAxios.post.mock.calls[0];

    expect(url).toBe(`${process.env.REACT_APP_API_URL}/api/mechanic/jobs/${jobId}/inspect`);
    expect(formData).toBeInstanceOf(FormData);
    expect((formData as FormData).get('notes')).toBe('All clear');
    expect((formData as FormData).get('photo')).toBe(mockPhoto);
    expect(config?.headers?.['Authorization']).toBe(`Bearer ${token}`);
    expect(config?.headers?.['Content-Type']).toBe('multipart/form-data');
  });

  it('should not append a photo if one is not provided', async () => {
    const inspectionData = { notes: 'No photo needed' };
    mockedAxios.post.mockResolvedValue({ data: { success: true } });

    await submitInspection(jobId, inspectionData, token);

    const formData = mockedAxios.post.mock.calls[0][1] as FormData;
    expect(formData.get('notes')).toBe('No photo needed');
    expect(formData.has('photo')).toBe(false);
  });

  it('should return a success object on successful submission', async () => {
    const inspectionData = { notes: 'Looks good' };
    mockedAxios.post.mockResolvedValue({ data: { inspectionId: 'insp_123' } });
    
    const result = await submitInspection(jobId, inspectionData, token);

    expect(result.success).toBe(true);
    expect(result.message).toContain('Inspection submitted successfully');
    expect(result.data).toEqual({ inspectionId: 'insp_123' });
  });

  it('should return a failure object on failed submission', async () => {
    const inspectionData = { notes: 'This will fail' };
    mockedAxios.post.mockRejectedValue(new Error('Network error'));
    
    const result = await submitInspection(jobId, inspectionData, token);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Submission failed');
  });
});