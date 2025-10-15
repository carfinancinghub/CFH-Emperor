// ----------------------------------------------------------------------
// File: PhotoProofUpload.test.tsx
// Path: frontend/src/components/common/__tests__/PhotoProofUpload.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A test suite for the universal PhotoProofUpload component.
//
// @architectural_notes
// - **Testing User Workflow**: This suite tests the full user workflow:
//   selecting a file, seeing the preview text, and clicking upload.
// - **Verifying Decoupled Logic**: We mock the `axios` call (representing our
//   'uploadService') to verify that the component correctly constructs the
//   'FormData' and calls the service on submission.
//
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import PhotoProofUpload from '../PhotoProofUpload';

// --- Mocks ---
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn(), warn: jest.fn() } }));

describe('PhotoProofUpload Component', () => {

  const mockOnUploadSuccess = jest.fn();
  const mockContext = { type: 'delivery_proof', sourceId: 'delivery-123' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component and allow a user to select a file', () => {
    render(<PhotoProofUpload onUploadSuccess={mockOnUploadSuccess} context={mockContext} />);
    
    const fileInput = screen.getByLabelText(/upload photo proof/i); // Assuming label is connected
    const testFile = new File(['hello'], 'hello.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [testFile] } });
    
    expect(screen.getByText('Selected: hello.png')).toBeInTheDocument();
  });

  it('should call the upload service with correct FormData on upload click', async () => {
    mockedAxios.post.mockResolvedValue({ data: { url: 'http://cloud.url/photo.png' } });
    render(<PhotoProofUpload onUploadSuccess={mockOnUploadSuccess} context={mockContext} />);

    const fileInput = screen.getByLabelText(/upload photo proof/i);
    const testFile = new File(['(⌐□_□)'], 'cool.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [testFile] } });
    fireEvent.change(screen.getByPlaceholderText(/Optional caption/i), { target: { value: 'A cool photo' } });
    fireEvent.click(screen.getByRole('button', { name: /Upload/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    const formData = mockedAxios.post.mock.calls[0][1] as FormData;
    expect(formData.get('photo')).toBe(testFile);
    expect(formData.get('caption')).toBe('A cool photo');
    expect(formData.get('type')).toBe('delivery_proof');
    expect(formData.get('sourceId')).toBe('delivery-123');

    expect(toast.success).toHaveBeenCalledWith('Photo uploaded successfully!');
    expect(mockOnUploadSuccess).toHaveBeenCalledWith({ url: 'http://cloud.url/photo.png' });
  });
});