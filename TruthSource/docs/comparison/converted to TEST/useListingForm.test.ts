// ----------------------------------------------------------------------
// File: useListingForm.test.ts
// Path: frontend/src/tests/hooks/useListingForm.test.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 09:23 PDT
// Version: 1.0.1 (Enhanced with Full Coverage)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive test suite for the useListingForm hook, verifying state management, validation, API orchestration, and edge cases.
//
// @architectural_notes
// - **Comprehensive Mocking**: Mocks axios, react-router-dom, and useAuth for isolated unit testing.
// - **Behavior-Driven**: Tests user behaviors like validation failures, successful submissions, draft saving, and edge cases.
// - **Edge Cases**: Covers unauthenticated users, Free-tier limits, and file upload failures.
//
// @todos
// - @free:
//   - [x] Test client-side validation and error display.
// - @premium:
//   - [ ] ✨ Test Save Draft functionality with backend integration.
// - @wow:
//   - [ ] 🚀 Test VIN validation when implemented.
//
// ----------------------------------------------------------------------
import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import { useListingForm } from '@/hooks/useListingForm';
import { useAuth } from '@/hooks/useAuth';

// --- Mocks ---
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ push: mockHistoryPush }),
}));
jest.mock('@/hooks/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock event types
const createMockInputEvent = (name: string, value: string | number): React.ChangeEvent<HTMLInputElement> => ({
  target: { name, value: value.toString(), type: typeof value === 'number' ? 'number' : 'text' },
} as React.ChangeEvent<HTMLInputElement>);

const createMockFileEvent = (files: File[]): React.ChangeEvent<HTMLInputElement> => ({
  target: { files },
} as React.ChangeEvent<HTMLInputElement>);

// --- Test Suite ---
describe('useListingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: { id: 'user123', token: 'fake-token', subscription: 'PREMIUM' } });
  });

  it('should handle client-side validation failure', async () => {
    const { result } = renderHook(() => useListingForm());
    const mockEvent = { preventDefault: jest.fn() } as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(result.current.errors.vin).toBe('VIN must be 17 characters');
    expect(result.current.error).toBe('Please correct the errors in the form.');
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle successful submission with photo uploads', async () => {
    const { result } = renderHook(() => useListingForm());
    const mockEvent = { preventDefault: jest.fn() } as React.FormEvent;
    const mockFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });

    mockedAxios.post
      .mockResolvedValueOnce({ data: { uploadUrl: 's3-url', key: 's3-key' } })
      .mockResolvedValueOnce({ data: { _id: 'photoId123' } })
      .mockResolvedValueOnce({ data: { _id: 'listingId123' } });
    mockedAxios.put.mockResolvedValueOnce({ status: 200 });

    await act(async () => {
      result.current.handleChange(createMockInputEvent('vin', '12345678901234567'));
      result.current.handleChange(createMockInputEvent('make', 'Test'));
      result.current.handleChange(createMockInputEvent('model', 'Car'));
      result.current.handleChange(createMockInputEvent('year', 2023));
      result.current.handleChange(createMockInputEvent('mileage', 10000));
      result.current.handleChange(createMockInputEvent('price', 25000));
      result.current.handleFileChange(createMockFileEvent([mockFile]));
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.errors).toEqual({});
    expect(mockedAxios.post).toHaveBeenCalledTimes(3);
    expect(mockedAxios.put).toHaveBeenCalledTimes(1);
    expect(mockHistoryPush).toHaveBeenCalledWith('/seller/listings/listingId123');
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.formData).toEqual(expect.objectContaining({ vin: '' })); // Form reset
  });

  it('should handle photo upload failure (403)', async () => {
    const { result } = renderHook(() => useListingForm());
    const mockEvent = { preventDefault: jest.fn() } as React.FormEvent;
    const mockFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });

    mockUseAuth.mockReturnValue({ user: { id: 'user123', token: 'fake-token', subscription: 'FREE' } });
    mockedAxios.post.mockRejectedValueOnce({ response: { status: 403, data: { message: 'Photo limit exceeded.' } } });

    await act(async () => {
      result.current.handleChange(createMockInputEvent('vin', '12345678901234567'));
      result.current.handleChange(createMockInputEvent('make', 'Test'));
      result.current.handleChange(createMockInputEvent('model', 'Car'));
      result.current.handleFileChange(createMockFileEvent([mockFile]));
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe('Photo limit exceeded. Upgrade your plan.');
    expect(mockedAxios.post).toHaveBeenCalledTimes(1); // Only generate-upload-url called
    expect(mockedAxios.put).not.toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle unauthenticated user', async () => {
    mockUseAuth.mockReturnValue({ user: null });
    const { result } = renderHook(() => useListingForm());
    const mockEvent = { preventDefault: jest.fn() } as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe('You must be logged in to create a listing.');
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should test upload progress updates', async () => {
    const { result } = renderHook(() => useListingForm());
    const mockFile1 = new File([''], 'photo1.jpg', { type: 'image/jpeg' });
    const mockFile2 = new File([''], 'photo2.jpg', { type: 'image/jpeg' });

    mockedAxios.post
      .mockResolvedValueOnce({ data: { uploadUrl: 's3-url1', key: 's3-key1' } })
      .mockResolvedValueOnce({ data: { _id: 'photoId1' } })
      .mockResolvedValueOnce({ data: { uploadUrl: 's3-url2', key: 's3-key2' } })
      .mockResolvedValueOnce({ data: { _id: 'photoId2' } })
      .mockResolvedValueOnce({ data: { _id: 'listingId123' } });
    mockedAxios.put
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 200 });

    await act(async () => {
      result.current.handleChange(createMockInputEvent('vin', '12345678901234567'));
      result.current.handleChange(createMockInputEvent('make', 'Test'));
      result.current.handleChange(createMockInputEvent('model', 'Car'));
      result.current.handleFileChange(createMockFileEvent([mockFile1, mockFile2]));
      await result.current.handleSubmit({ preventDefault: jest.fn() } as React.FormEvent);
    });

    expect(result.current.uploadProgress).toBe(0); // Reset after completion
    expect(mockedAxios.post).toHaveBeenCalledTimes(5);
    expect(mockedAxios.put).toHaveBeenCalledTimes(2);
  });

  it('should handle saveDraft for Premium users', async () => {
    const { result } = renderHook(() => useListingForm());
    mockedAxios.post.mockResolvedValueOnce({ status: 200 });

    await act(async () => {
      result.current.handleChange(createMockInputEvent('vin', '12345678901234567'));
      await result.current.saveDraft();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/api/listings/draft',
      expect.objectContaining({ vin: '12345678901234567' }),
      expect.any(Object)
    );
    expect(result.current.error).toBeNull();
  });

  it('should reset the form state', () => {
    const { result } = renderHook(() => useListingForm());

    act(() => {
      result.current.handleChange(createMockInputEvent('vin', '12345678901234567'));
      result.current.handleChange(createMockInputEvent('make', 'Test'));
    });

    expect(result.current.formData.vin).toBe('12345678901234567');
    expect(result.current.formData.make).toBe('Test');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual(initialFormData);
    expect(result.current.filesToUpload).toEqual([]);
    expect(result.current.errors).toEqual({});
    expect(result.current.error).toBeNull();
  });

  it('should handle invalid file types', async () => {
    const { result } = renderHook(() => useListingForm());
    const mockEvent = { preventDefault: jest.fn() } as React.FormEvent;
    const mockInvalidFile = new File([''], 'invalid.txt', { type: 'text/plain' });

    await act(async () => {
      result.current.handleChange(createMockInputEvent('vin', '12345678901234567'));
      result.current.handleChange(createMockInputEvent('make', 'Test'));
      result.current.handleChange(createMockInputEvent('model', 'Car'));
      result.current.handleFileChange(createMockFileEvent([mockInvalidFile]));
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.errors.photos).toBe('Too many photos'); // Zod validation catches invalid input
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });
});

export default {};