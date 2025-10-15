// ----------------------------------------------------------------------
// File: usePhotoUploader.ts
// Path: frontend/src/hooks/usePhotoUploader.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 3:22 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A powerful, reusable hook for managing the entire file upload process.
// It uses a secure, two-phase pre-signed URL flow.
//
// @architectural_notes
// - **Decoupled & Reusable**: By accepting 'context' and 'contextId', this
//   single hook can be used for listings, profile pictures, dispute evidence, etc.
// - **Stateful Progress**: The hook manages its own state for upload progress
//   and final photo URLs, providing a rich user experience.
//
// @todos
// - @free:
//   - [ ] Implement cancellation logic for in-progress uploads.
// - @premium:
//   - [ ] ✨ Add support for video file uploads with specific validation.
// - @wow:
//   - [ ] 🚀 Implement chunked uploading for very large files to improve reliability.
//
// ----------------------------------------------------------------------

import { useState, useCallback } from 'react';
import axios from 'axios';

interface UploaderProps {
  context: 'LISTING' | 'PROFILE' | 'DISPUTE_EVIDENCE';
  contextId: string;
}

export const usePhotoUploader = ({ context, contextId }: UploaderProps) => {
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [fileName: string]: number }>({});
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    const fileName = file.name;
    try {
      // Phase 1: Get a pre-signed URL from our backend
      const { data: { uploadUrl, key } } = await axios.post('/api/photos/generate-upload-url', {
        contentType: file.type,
      });

      // Phase 2: Upload the file directly to cloud storage, tracking progress
      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({ ...prev, [fileName]: percentCompleted }));
        },
      });

      // Phase 3: Save the photo reference in our database
      const { data: newPhoto } = await axios.post('/api/photos/save-reference', {
        key,
        context,
        contextId,
        metadata: { size: file.size, contentType: file.type },
      });

      setUploadedPhotos(prev => [...prev, newPhoto]);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileName];
        return newProgress;
      });

    } catch (err: any) {
      setError(`Upload failed for ${fileName}. Please try again.`);
      console.error(err);
    }
  }, [context, contextId]);

  return { uploadedPhotos, uploadProgress, error, uploadFile };
};