// ----------------------------------------------------------------------
// File: PhotoService.ts
// Path: backend/services/PhotoService.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 08:40 PDT
// Version: 2.1.1 (Validation & Upload Logic Enhanced)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The core service for securely handling all image and video assets, with validation and cloud upload capabilities.
//
// @architectural_notes
// - **Secure Validation**: The 'validatePhotoIds' method ensures photos belong to the user, preventing cross-account tampering.
// - **Cloud Integration**: Uses pre-signed URLs for secure uploads to cloud storage (e.g., AWS S3).
// - **Auditable**: Logs validation events to HistoryService for traceability.
//
// @todos
// - @premium:
//   - [ ] ✨ Implement analyzePhotoQuality for Premium users to check image resolution.
// - @wow:
//   - [ ] 🚀 Add AI-based photo enhancement (e.g., auto-crop, lighting correction).
//
// ----------------------------------------------------------------------
import Photo, { IPhoto } from '@/models/Photo';
import HistoryService from '@/services/HistoryService';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Custom Error for this service
class PhotoError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const PhotoService = {
  /**
   * Generates a pre-signed URL for secure photo upload to cloud storage.
   * @throws {PhotoError} If URL generation fails.
   */
  async getPresignedUploadUrl(userId: string, fileName: string): Promise<string> {
    const key = `uploads/${userId}/${Date.now()}_${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: 'image/*',
    });
    try {
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      throw new PhotoError('Failed to generate upload URL.', 500);
    }
  },

  /**
   * Saves a reference to an uploaded photo in the database.
   * @throws {PhotoError} If saving fails.
   */
  async savePhotoReference(userId: string, url: string, metadata: object): Promise<IPhoto> {
    const photo = new Photo({ url, owner: userId, metadata });
    await photo.save();
    HistoryService.logAction(userId, 'SAVE_PHOTO', { photoId: photo._id }).catch(console.error);
    return photo;
  },

  /**
   * Validates that an array of photo IDs are valid and belong to a specific user.
   * @param returnDetails If true, returns populated photo metadata.
   * @throws {PhotoError} If any photo is not found or not owned by the user.
   */
  async validatePhotoIds(photoIds: string[], userId: string, returnDetails: boolean = false): Promise<boolean | IPhoto[]> {
    if (!photoIds || photoIds.length === 0) {
      return returnDetails ? [] : true;
    }
    const query = { _id: { $in: photoIds }, owner: userId };
    if (returnDetails) {
      const photos = await Photo.find(query).select('url metadata');
      if (photos.length !== photoIds.length) {
        throw new PhotoError('One or more photos are invalid or do not belong to you.', 403);
      }
      HistoryService.logAction(userId, 'VALIDATE_PHOTOS', { photoIds }).catch(console.error);
      return photos;
    }
    const photoCount = await Photo.countDocuments(query);
    if (photoCount !== photoIds.length) {
      throw new PhotoError('One or more photos are invalid or do not belong to you.', 403);
    }
    HistoryService.logAction(userId, 'VALIDATE_PHOTOS', { photoIds }).catch(console.error);
    return true;
  },
};

export default PhotoService;