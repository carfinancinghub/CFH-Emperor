// ----------------------------------------------------------------------
// File: PhotoProofUpload.tsx
// Path: frontend/src/components/common/PhotoProofUpload.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A universal, reusable React component for uploading photo proof with a
// caption. Handles file selection, submission, and feedback.
//
// @usage
// Import and use this component anywhere a photo upload is required. The
// `onUploadSuccess` callback allows it to integrate with any parent form or page.
// e.g., `<PhotoProofUpload context={{ type: 'inspection', sourceId: 'job-123' }} onUploadSuccess={handleSuccess} />`
//
// @architectural_notes
// - **Universal & Reusable**: This component is designed to be generic. The `context`
//   prop allows us to pass metadata (like the type of upload and its related ID)
//   to the backend, making the component usable for inspections, delivery proof, etc.
// - **Decoupled API Logic**: All `axios` logic is encapsulated in the `uploadService`,
//   adhering to our standard of separating data logic from the UI.
//
// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Allow users to upload multiple photos at once.
// @premium:
//   - [ ] ✨ Enable uploading of short video clips (<30 seconds) in addition to photos.
// @wow:
//   - [ ] 🚀 Add an option to submit the photo for blockchain verification, creating an immutable, timestamped record of the evidence.
//
// ----------------------------------------------------------------------

import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { theme } from '@/styles/theme';

// --- Type Definitions ---
interface UploadContext {
  type: 'inspection' | 'delivery_proof' | 'profile_avatar';
  sourceId: string;
}
interface UploadResult {
  url: string;
  // ... other metadata from the server
}

// --- Decoupled API Service ---
const uploadService = {
  uploadPhoto: (formData: FormData, token: string | null) => {
    return axios.post<UploadResult>(
      `${process.env.REACT_APP_API_URL}/api/uploads`,
      formData,
      { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
    );
  }
};

// --- The Component ---
interface PhotoProofUploadProps {
  onUploadSuccess: (result: UploadResult) => void;
  context: UploadContext;
}

const PhotoProofUpload: React.FC<PhotoProofUploadProps> = ({ onUploadSuccess, context }) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [caption, setCaption] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const token = localStorage.getItem('token');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warn('Please select a photo to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('caption', caption);
    formData.append('type', context.type);
    formData.append('sourceId', context.sourceId);

    setUploading(true);
    try {
      const res = await uploadService.uploadPhoto(formData, token);
      onUploadSuccess(res.data);
      toast.success('Photo uploaded successfully!');
      setFile(null);
      setCaption('');
    } catch (err) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded bg-white shadow">
      <h3 className="text-lg font-semibold">📸 Upload Photo Proof</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
      {file && <div className="text-sm text-gray-600">Selected: {file.name}</div>}
      <textarea
        placeholder="Optional caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border px-2 py-1 rounded"
      />
      {uploading ? <LoadingSpinner /> : <Button onClick={handleUpload} disabled={!file}>🚀 Upload</Button>}
    </div>
  );
};

export default PhotoProofUpload;