// File: SellerCreateListing.tsx
// Path: frontend/src/pages/seller/SellerCreateListing.tsx
// 👑 Cod1 Crown Certified — A robust, dedicated form for creating new seller listings.

// TODO:
// @free:
//   - [ ] Add client-side validation using React Hook Form's built-in capabilities (e.g., min/max length, required fields) for instant user feedback.
// @premium:
//   - [ ] ✨ Integrate the <SellerPricingTool /> component directly into this form to allow sellers to get price suggestions while editing.
// @wow:
//   - [ ] 🚀 Implement a "Draft" feature that automatically saves form changes to localStorage, allowing a seller to resume editing later if they accidentally close the tab.

import React from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

// --- Type Definitions ---
// A subset of ICarListing for creation
type CreateListingData = {
  make: string; model: string; year: number; price: number;
};

// --- Decoupled API Logic ---
const createListing = async (formData: CreateListingData, token: string | null) => {
  return axios.post('/api/listings', formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// --- The Form Component ---
const SellerCreateListing: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<CreateListingData>();

  const onSubmit: SubmitHandler<CreateListingData> = async (formData) => {
    try {
      await createListing(formData, token);
      toast.success('Listing created successfully! It is now pending review.');
      reset(); // Clear the form
      navigate('/seller/dashboard');
    } catch (err) {
      toast.error('Failed to create listing. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Create a New Listing</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Make" placeholder="e.g., Tesla" {...register("make", { required: true })} />
          <Input label="Model" placeholder="e.g., Model Y" {...register("model", { required: true })} />
          <Input label="Year" type="number" placeholder="e.g., 2024" {...register("year", { required: true, valueAsNumber: true })} />
          <Input label="Price" type="number" placeholder="e.g., 50000" {...register("price", { required: true, valueAsNumber: true })} />
          
          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/seller/dashboard')}>Cancel</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default SellerCreateListing;