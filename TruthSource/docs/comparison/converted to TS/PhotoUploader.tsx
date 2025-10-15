// ----------------------------------------------------------------------
// File: PhotoUploader.tsx
// Path: frontend/src/components/common/PhotoUploader.tsx
// Author: Gemini, System Architect
// Created: August 11, 2025 at 3:22 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The single, unified UI component for all photo uploads across the platform.
//
// @architectural_notes
// - **Purely Presentational**: This component is "dumb." It contains no logic
//   and simply renders the UI based on the state provided by the usePhotoUploader hook.
//
// ----------------------------------------------------------------------

import React from 'react';
import { usePhotoUploader } from '@/hooks/usePhotoUploader';

interface PhotoUploaderProps {
  context: 'LISTING' | 'PROFILE' | 'DISPUTE_EVIDENCE';
  contextId: string;
}

const PhotoUploader = ({ context, contextId }: PhotoUploaderProps) => {
  const { uploadedPhotos, uploadProgress, error, uploadFile } = usePhotoUploader({ context, contextId });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      Array.from(event.target.files).forEach(file => uploadFile(file));
    }
  };

  return (
    <div>
      <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center">
        <input type="file" multiple onChange={handleFileSelect} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      <div className="mt-4">
        {Object.entries(uploadProgress).map(([fileName, progress]) => (
          <div key={fileName} className="mb-2">
            <p className="text-sm font-medium text-gray-700">{fileName}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {uploadedPhotos.map(photo => (
          <div key={photo._id}>
            <img src={photo.url} alt="Uploaded content" className="rounded-lg object-cover h-24 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoUploader;