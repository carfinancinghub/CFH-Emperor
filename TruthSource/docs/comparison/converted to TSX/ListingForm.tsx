// ----------------------------------------------------------------------
// File: ListingForm.tsx
// Path: frontend/src/components/listings/ListingForm.tsx
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 09:14 PDT
// Version: 2.1.1 (Enhanced with Full Fields & Accessibility)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive, production-ready UI component for creating and editing vehicle listings, powered by useListingForm.
//
// @architectural_notes
// - **Purely Presentational**: Renders UI based on useListingForm state, with no business logic.
// - **Rich User Feedback**: Displays upload progress, global, and field-specific errors for better UX.
// - **Accessible**: Includes ARIA attributes for inclusivity.
// - **Responsive**: Optimized for mobile and desktop with Tailwind CSS.
//
// @todos
// - @free:
//   - [x] Add field-specific error display for client-side validation.
// - @premium:
//   - [ ] ✨ Visually indicate Save Draft availability based on user tier.
// - @wow:
//   - [ ] 🚀 Add VIN auto-suggest dropdown for Wow++ users.
//
// ----------------------------------------------------------------------
import React from 'react';
import { useListingForm } from '@/hooks/useListingForm';
import { useAuth } from '@/hooks/useAuth'; // Assuming auth hook exists

const ListingForm = () => {
  const {
    formData,
    isSubmitting,
    error,
    errors, // Field-specific errors from Zod
    uploadProgress,
    handleChange,
    handleFileChange,
    handleSubmit,
    saveDraft,
    resetForm, // New callback to clear form
  } = useListingForm();
  const { user } = useAuth();

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-8 space-y-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto"
      aria-label="Create a new vehicle listing"
    >
      <h2 className="text-2xl font-bold text-gray-900">Create a New Listing</h2>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* VIN Input */}
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
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors?.vin ? 'border-red-500' : ''
            }`}
            required
            aria-describedby={errors?.vin ? 'vin-error' : undefined}
          />
          {errors?.vin && (
            <p id="vin-error" className="mt-1 text-sm text-red-600">
              {errors.vin}
            </p>
          )}
        </div>

        {/* Make Input */}
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700">
            Make
          </label>
          <input
            type="text"
            name="make"
            id="make"
            value={formData.make}
            onChange={handleChange}
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors?.make ? 'border-red-500' : ''
            }`}
            required
            aria-describedby={errors?.make ? 'make-error' : undefined}
          />
          {errors?.make && (
            <p id="make-error" className="mt-1 text-sm text-red-600">
              {errors.make}
            </p>
          )}
        </div>

        {/* Model Input */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Model
          </label>
          <input
            type="text"
            name="model"
            id="model"
            value={formData.model}
            onChange={handleChange}
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors?.model ? 'border-red-500' : ''
            }`}
            required
            aria-describedby={errors?.model ? 'model-error' : undefined}
          />
          {errors?.model && (
            <p id="model-error" className="mt-1 text-sm text-red-600">
              {errors.model}
            </p>
          )}
        </div>

        {/* Year Input */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <input
            type="number"
            name="year"
            id="year"
            value={formData.year}
            onChange={handleChange}
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors?.year ? 'border-red-500' : ''
            }`}
            required
            aria-describedby={errors?.year ? 'year-error' : undefined}
          />
          {errors?.year && (
            <p id="year-error" className="mt-1 text-sm text-red-600">
              {errors.year}
            </p>
          )}
        </div>

        {/* Mileage Input */}
        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
            Mileage
          </label>
          <input
            type="number"
            name="mileage"
            id="mileage"
            value={formData.mileage}
            onChange={handleChange}
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors?.mileage ? 'border-red-500' : ''
            }`}
            required
            aria-describedby={errors?.mileage ? 'mileage-error' : undefined}
          />
          {errors?.mileage && (
            <p id="mileage-error" className="mt-1 text-sm text-red-600">
              {errors.mileage}
            </p>
          )}
        </div>

        {/* Price Input */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors?.price ? 'border-red-500' : ''
            }`}
            required
            aria-describedby={errors?.price ? 'price-error' : undefined}
          />
          {errors?.price && (
            <p id="price-error" className="mt-1 text-sm text-red-600">
              {errors.price}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
            errors?.description ? 'border-red-500' : ''
          }`}
          aria-describedby={errors?.description ? 'description-error' : undefined}
        />
        {errors?.description && (
          <p id="description-error" className="mt-1 text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      {/* Photo Uploader */}
      <div>
        <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
          Photos
        </label>
        <input
          type="file"
          name="photos"
          id="photos"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          aria-describedby={errors?.photos ? 'photos-error' : undefined}
        />
        {errors?.photos && (
          <p id="photos-error" className="mt-1 text-sm text-red-600">
            {errors.photos}
          </p>
        )}
      </div>

      {/* Upload Progress Bar */}
      {isSubmitting && uploadProgress > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700">Uploading photos...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          className="p-3 bg-red-100 text-red-700 rounded-md text-sm"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={resetForm}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-200"
        >
          Clear Form
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={saveDraft}
            disabled={isSubmitting || user?.subscription !== 'PREMIUM'}
            className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-200 ${
              user?.subscription !== 'PREMIUM' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-disabled={user?.subscription !== 'PREMIUM'}
          >
            Save Draft (Premium ✨)
          </button>
          {user?.subscription !== 'PREMIUM' && (
            <span className="absolute -top-8 left-0 text-xs text-gray-500">
              Upgrade to Premium to save drafts
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {isSubmitting ? 'Submitting...' : 'Publish Listing'}
        </button>
      </div>
    </form>
  );
};

export default ListingForm;