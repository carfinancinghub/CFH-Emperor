// ----------------------------------------------------------------------
// File: useListingForm.ts
// Path: frontend/src/hooks/useListingForm.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 09:01 PDT
// Version: 2.0.3 (Enhanced with File Type Validation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive, production-ready hook for the vehicle listing form, handling state, photo uploads, submission, and field-specific validation.
//
// @architectural_notes
// - **Orchestrates Photo Uploads**: Communicates with PhotoService for secure uploads, ensuring listing completeness.
// - **Comprehensive State Management**: Manages form data, file progress, loading, field-specific errors, and reset functionality.
// - **Client-Side Validation**: Uses Zod for instant feedback, with per-field error display, including file type checks.
// - **Auth Integration**: Pulls user ID from auth context for secure API calls.
//
// @todos
// - @free:
//   - [x] Add client-side validation with Zod for instant user feedback.
// - @premium:
//   - [ ] ✨ Implement saveDraft with backend persistence.
// - @wow:
//   - [ ] 🚀 Implement real-time VIN validation against a third-party API.
//
// ----------------------------------------------------------------------
import { useState, useCallback } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';

// Zod schema for client-side validation (mirrors ListingSchema.ts)
const ListingFormSchema = z.object({
  vin: z.string().min(17, 'VIN must be 17 characters').max(17),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(2026),
  mileage: z.number().min(0, 'Mileage cannot be negative'),
  price: z.number().min(0, 'Price cannot be negative'),
  description: z.string().max(1000, 'Description too long'),
  photos: z.array(z.string()).max(20, 'Too many photos'),
});

type ListingInput = z.infer<typeof ListingFormSchema>;
type FormErrors = Partial<Record<keyof ListingInput, string>>;

const initialFormData: ListingInput = {
  vin: '',
  make: '',
  model: '',
  year: 2025,
  mileage: 0,
  price: 0,
  description: '',
  photos: [],
};

export const useListingForm = () => {
  const [formData, setFormData] = useState<ListingInput>(initialFormData);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const history = useHistory();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Validate file types
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const invalidFiles = files.filter(file => !validTypes.includes(file.type));
      if (invalidFiles.length > 0) {
        setErrors(prev => ({ ...prev, photos: 'Only JPEG, PNG, or GIF files are allowed' }));
        return;
      }
      setFilesToUpload(files);
      setErrors(prev => ({ ...prev, photos: undefined }));
    }
  };

  const validateForm = useCallback((): boolean => {
    try {
      ListingFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        err.errors.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0] as keyof ListingInput] = e.message;
        });
        setErrors(fieldErrors);
        setError('Please correct the errors in the form.');
        return false;
      }
      setError('Invalid form data');
      return false;
    }
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user?.id) {
      setError('You must be logged in to create a listing.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const photoIds = await uploadPhotos(filesToUpload);
      const finalListingData = { ...formData, photos: photoIds };
      const response = await axios.post('/api/listings', finalListingData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFormData(initialFormData);
      setFilesToUpload([]);
      setIsSubmitting(false);
      history.push(`/seller/listings/${response.data._id}`);
    } catch (err: any) {
      setIsSubmitting(false);
      if (err.response?.status === 403) {
        setError('Photo limit exceeded. Upgrade your plan.');
      } else if (err.response?.status === 404) {
        setError('Listing or resource not found.');
      } else {
        setError(err.response?.data?.message || 'An unexpected error occurred.');
      }
    }
  };

  const uploadPhotos = async (files: File[]): Promise<string[]> => {
    const uploadedPhotoIds: string[] = [];
    const totalFiles = files.length;
    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      setUploadProgress(((i + 1) / totalFiles) * 100);
      const { data: { uploadUrl, key } } = await axios.post(
        '/api/photos/generate-upload-url',
        { contentType: file.type },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      await axios.put(uploadUrl, file, { headers: { 'Content-Type': file.type } });
      const { data: newPhoto } = await axios.post(
        '/api/photos/save-reference',
        { key, context: 'LISTING', metadata: { size: file.size, contentType: file.type } },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      uploadedPhotoIds.push(newPhoto._id);
    }
    setUploadProgress(0);
    return uploadedPhotoIds;
  };

  const saveDraft = async () => {
    if (!user?.id) return;
    try {
      await axios.post('/api/listings/draft', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch (err) {
      setError('Failed to save draft.');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFilesToUpload([]);
    setErrors({});
    setError(null);
  };

  return { formData, isSubmitting, error, errors, uploadProgress, handleChange, handleFileChange, handleSubmit, saveDraft, resetForm };
};