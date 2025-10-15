// ----------------------------------------------------------------------
// File: PhotoService.test.ts
// Path: backend/tests/services/PhotoService.test.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 3:28 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the PhotoService. These tests verify the service's
// integration with cloud storage SDKs and database models.
//
// @architectural_notes
// - **Comprehensive Mocking**: This suite fully mocks the AWS S3 SDK and
//   the 'Photo' Mongoose model to ensure the service logic can be tested
//   independently of its external dependencies.
//
// @todos
// - @free:
//   - [ ] Add tests for error handling scenarios, such as when S3 fails to generate a URL.
// - @premium:
//   - [ ] ✨ Add tests for the 'applyWatermark' function once implemented.
// - @wow:
//   - [ ] 🚀 Add tests for the 'analyzePhotoQuality' AI function, mocking the AI service response.
//
// ----------------------------------------------------------------------

import PhotoService from '@/services/PhotoService';
import Photo from '@/models/Photo';
import AWS from 'aws-sdk';

// Mock the dependencies
jest.mock('@/models/Photo');

const mockGetSignedUrlPromise = jest.fn().mockResolvedValue('https://mock-s3-url.com/upload');
jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ({
      getSignedUrlPromise: mockGetSignedUrlPromise,
    })),
  };
});

describe('PhotoService', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Tests for getPresignedUploadUrl ---
  describe('getPresignedUploadUrl', () => {
    it('should request a pre-signed URL from S3 with correct parameters', async () => {
      const contentType = 'image/jpeg';
      await PhotoService.getPresignedUploadUrl(contentType);

      expect(mockGetSignedUrlPromise).toHaveBeenCalledWith('putObject', {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: expect.any(String), // The key is dynamic, so we just check it's a string
        ContentType: contentType,
        Expires: 300, // 5 minutes in seconds
      });
    });

    it('should return the uploadUrl and key', async () => {
      const result = await PhotoService.getPresignedUploadUrl('image/png');

      expect(result).toHaveProperty('uploadUrl', 'https://mock-s3-url.com/upload');
      expect(result).toHaveProperty('key');
      expect(typeof result.key).toBe('string');
    });
  });

  // --- Tests for savePhotoReference ---
  describe('savePhotoReference', () => {
    it('should create and save a new Photo document with the correct details', async () => {
      const mockSave = jest.fn().mockResolvedValue(true);
      (Photo as jest.Mock).mockImplementation(() => ({
        save: mockSave,
      }));
      
      const args = {
        userId: 'user123',
        context: 'LISTING',
        contextId: 'listing123',
        photoKey: 'uploads/some-photo-key',
        metadata: { size: 1024, contentType: 'image/jpeg' }
      };

      await PhotoService.savePhotoReference(
        args.userId,
        args.context,
        args.contextId,
        args.photoKey,
        args.metadata
      );
      
      const expectedUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${args.photoKey}`;

      expect(Photo).toHaveBeenCalledWith({
        url: expectedUrl,
        key: args.photoKey,
        owner: args.userId,
        context: args.context,
        contextId: args.contextId,
        metadata: args.metadata
      });
      expect(mockSave).toHaveBeenCalled();
    });
  });
});