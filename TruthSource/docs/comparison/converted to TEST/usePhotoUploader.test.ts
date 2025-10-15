// ----------------------------------------------------------------------
// File: usePhotoUploader.test.ts
// Path: frontend/src/tests/hooks/usePhotoUploader.test.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 3:29 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the usePhotoUploader hook. These tests verify the complex,
// three-phase upload orchestration performed by the hook.
//
// @architectural_notes
// - **Process Simulation**: This test suite mocks the entire upload flow,
//   simulating responses from our backend and the cloud storage provider to
//   ensure the hook handles each phase correctly.
//
// ----------------------------------------------------------------------

import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import { usePhotoUploader } from '@/hooks/usePhotoUploader';

// Mock the axios library
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('usePhotoUploader', () => {
  const hookProps = { context: 'LISTING' as const, contextId: 'listing123' };

  beforeEach(() => {
    // Reset all mock implementations before each test
    mockedAxios.post.mockReset();
    mockedAxios.put.mockReset();
  });

  it('should successfully orchestrate the three-phase upload process', async () => {
    // Arrange: Set up mock responses for each phase
    const mockFile = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const mockUploadUrl = 'https://s3-upload-url.com/path';
    const mockKey = 'uploads/some-key';
    const mockNewPhoto = { _id: 'photo123', url: `https://s3-final-url.com/${mockKey}` };

    // Phase 1 Response
    mockedAxios.post.mockResolvedValueOnce({ data: { uploadUrl: mockUploadUrl, key: mockKey } });
    // Phase 2 Response
    mockedAxios.put.mockResolvedValueOnce({ status: 200 });
    // Phase 3 Response
    mockedAxios.post.mockResolvedValueOnce({ data: mockNewPhoto });

    // Act
    const { result, waitForNextUpdate } = renderHook(() => usePhotoUploader(hookProps));

    await act(async () => {
      // Initiate the upload
      result.current.uploadFile(mockFile);
      // Wait for all async operations and state updates to complete
      await waitForNextUpdate();
      await waitForNextUpdate();
    });

    // Assert
    // Phase 1: Check if we requested the pre-signed URL
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/photos/generate-upload-url', {
      contentType: mockFile.type,
    });
    // Phase 2: Check if we uploaded the file to the received URL
    expect(mockedAxios.put).toHaveBeenCalledWith(mockUploadUrl, mockFile, expect.any(Object));
    // Phase 3: Check if we saved the reference to our backend
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/photos/save-reference', {
      key: mockKey,
      context: hookProps.context,
      contextId: hookProps.contextId,
      metadata: { size: mockFile.size, contentType: mockFile.type },
    });

    // Final State Check
    expect(result.current.uploadedPhotos).toHaveLength(1);
    expect(result.current.uploadedPhotos[0]).toEqual(mockNewPhoto);
    expect(result.current.error).toBeNull();
  });

  it('should set an error state if getting the pre-signed URL fails', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const errorMessage = 'Failed to generate URL';
    mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

    const { result, waitForNextUpdate } = renderHook(() => usePhotoUploader(hookProps));

    await act(async () => {
      result.current.uploadFile(mockFile);
      await waitForNextUpdate();
    });

    expect(result.current.error).toContain('Upload failed for test.png');
    expect(result.current.uploadedPhotos).toHaveLength(0);
  });
});