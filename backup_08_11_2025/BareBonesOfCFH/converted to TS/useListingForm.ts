// ----------------------------------------------------------------------
// File: useListingForm.ts
// Path: frontend/src/hooks/useListingForm.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 12:28 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A hook to encapsulate all state management, validation, and submission
// logic for the vehicle listing form.
//
// @architectural_notes
// - **Decoupled Logic**: This hook allows the `ListingForm` component to be
//   purely presentational, adhering to our hook-based architecture.
// - **Centralized State**: It centralizes all form logic (`formData`,
//   `isLoading`, `error`) for easier testing and maintenance.
//
// @todos
// - @free:
//   - [ ] Integrate Zod for real-time, client-side validation feedback.
// - @premium:
//   - [ ] ✨ Add a "Save Draft" feature that automatically saves form state to local storage.
// - @wow:
//   - [ ] 🚀 Implement a real-time VIN validation check that hits a VIN decoding API as the user types.
//
// ----------------------------------------------------------------------

import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const initialFormData = {
  vin: '',
  make: '',
  model: '',
  year: '',
  mileage: '',
  price: '',
  description: '',
  photos: [],
};

export const useListingForm = () => {
  const [formData, setFormData] = useState(initialFormData); //
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); //
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // This logic is a placeholder for the real cloud upload service.
      // The real service will return URLs to be stored here.
      setFormData({ ...formData, photos: Array.from(e.target.files) }); //
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //
    setIsLoading(true);
    setError(null);

    try {
      // NOTE: This will require the future Photo Management System to first
      // upload photos and return URLs before this submission happens.
      const response = await axios.post('/api/seller/listings', formData); //
      
      setIsLoading(false);
      // Redirect to the new listing's page or seller dashboard on success
      history.push(`/seller/listings/${response.data._id}`);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Failed to create listing.');
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
};