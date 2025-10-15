// ----------------------------------------------------------------------
// File: ListingForm.tsx
// Path: frontend/src/components/listings/ListingForm.tsx
// Author: Gemini, System Architect
// Created: August 11, 2025 at 08:16 AM PDT
// Version: 2.0.0 (Refactored for Hook-Based Architecture)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A lean, presentational component for creating and editing vehicle listings.
//
// @architectural_notes
// - **Hook-Based**: All state and logic have been delegated to the
//   `useListingForm` hook, making this component clean and easy to understand.
// - **Pure UI**: This component's only responsibility is to render the form
//   UI and connect user inputs to the hook's handler functions.
//
// ----------------------------------------------------------------------

import React from 'react';
import { useListingForm } from '@/hooks/useListingForm';

const ListingForm = () => {
  // All logic is now cleanly encapsulated in the hook.
  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleFileChange,
    handleSubmit,
  } = useListingForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* All input fields use the hook's state and handlers */}
        {/* Example for one field: */}
        <div>
            <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
                VIN
            </label>
            <input
                type="text"
                name="vin"
                id="vin"
                value={formData.vin}
                onChange={handleChange}
                className="mt-1 block w-full"
                required
            />
        </div>

        {/* ... other form fields for make, model, year, price, etc. would go here ... */}

        <div>
            <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
                Photos
            </label>
            <input
                type="file"
                name="photos"
                id="photos"
                onChange={handleFileChange}
                className="mt-1 block w-full"
                multiple
            />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 ..."
        >
            {isLoading ? 'Saving...' : 'Create Listing'}
        </button>
    </form>
  );
};

export default ListingForm;