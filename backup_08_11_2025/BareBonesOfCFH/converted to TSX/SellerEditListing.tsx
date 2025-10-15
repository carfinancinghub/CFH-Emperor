// ----------------------------------------------------------------------
// File: SellerEditListing.tsx
// Path: frontend/src/components/seller/SellerEditListing.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A robust, dedicated form for sellers to edit an existing vehicle listing.
//
// @usage
// This component should be used on a dedicated route like '/seller/listings/:id/edit'.
// It is self-contained and manages its own data fetching and submission logic
// via the internal 'useEditableListing' hook.
//
// @architectural_notes
// - This component follows the **Custom Hook for Data Logic** pattern. All API
//   interactions and state management are handled by the `useEditableListing` hook.
//   The main component should remain purely presentational.
// - Form state and validation are managed by the **React Hook Form** library. This
//   is the standard for all non-trivial forms in this application.
// - All user feedback (success/error messages) MUST be handled by the non-blocking
//   `toast` notification system. Do not use native browser `alert()`.
//
// ----------------------------------------------------------------------

// --- COMMANDS ---
// @command: generate-component-suite
// @description: "Generates a full suite of related files for this component."
// @example: "npm run gen-suite -- --component=SellerEditListing --includeTests --includeStorybook"

// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Add client-side validation using React Hook Form's built-in capabilities.
// @premium:
//   - [ ] ✨ Integrate the <SellerPricingTool /> component directly into this form.
// @wow:
//   - [ ] 🚀 Implement a "Draft" feature that automatically saves form changes.

// --- IMPORTS ---
import React from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

// --- Type Definitions (re-using ICarListing) ---
interface ICarListing {
  _id: string; year: number; make: string; model: string; status: string;
  price: number; mileage?: number; vin?: string; conditionGrade?: string;
  location?: string; tags?: string[]; createdAt: string; images?: string[]; description?: string;
}

// --- ARCHITECTURAL UPGRADE: Decoupled Data & Logic Hook ---
const useEditableListing = (id?: string) => {
  const [listing, setListing] = React.useState<ICarListing | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    if (!id) return;
    axios.get<ICarListing>(`${process.env.REACT_APP_API_URL}/api/seller/listings/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setListing(res.data))
      .catch(() => toast.error('Failed to load listing data.'))
      .finally(() => setLoading(false));
  }, [id, token]);

  const updateListing = async (formData: ICarListing): Promise<boolean> => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/seller/listings/${id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Listing updated successfully!');
      return true;
    } catch (err) {
      toast.error('Error updating listing.');
      return false;
    }
  };

  return { listing, loading, updateListing };
};

// --- The Form Component ---
const SellerEditListing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listing, loading, updateListing } = useEditableListing(id);

  // ARCHITECTURAL UPGRADE: Using React Hook Form for state management and submission
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ICarListing>();
  
  // Pre-populate the form once the listing data is loaded
  React.useEffect(() => {
    if (listing) {
      reset({ ...listing, tags: listing.tags?.join(', ') as any }); // Convert tags array to string for the input
    }
  }, [listing, reset]);

  const onSubmit: SubmitHandler<ICarListing> = async (formData) => {
    // Convert tags string back to array before submission
    const dataToSubmit = {
        ...formData,
        tags: (formData.tags as any as string)?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
    };
    const success = await updateListing(dataToSubmit);
    if (success) {
      navigate(`/seller/listings/${id}`);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">✏️ Edit Listing</h1>
      
      <Input label="Make" {...register("make", { required: true })} />
      <Input label="Model" {...register("model", { required: true })} />
      <Input label="Year" type="number" {...register("year", { required: true, valueAsNumber: true })} />
      <Input label="Price" type="number" {...register("price", { required: true, valueAsNumber: true })} />
      <Input label="Mileage" type="number" {...register("mileage", { valueAsNumber: true })} />
      <Input label="VIN" {...register("vin")} />
      <Input label="Location" {...register("location")} />
      <Input label="Condition Grade" placeholder="Excellent, Good, Fair" {...register("conditionGrade")} />
      <Input label="Tags (comma-separated)" {...register("tags")} />
      
      <textarea
        {...register("description")}
        className="w-full border p-2 rounded"
        rows={5}
        placeholder="Car description..."
      />

      <div className="flex gap-4 mt-4">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
      </div>
    </form>
  );
};

export default SellerEditListing;