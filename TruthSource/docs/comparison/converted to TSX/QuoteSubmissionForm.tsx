// ----------------------------------------------------------------------
// File: QuoteSubmissionForm.tsx
// Path: frontend/src/features/insurance/QuoteSubmissionForm.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:05 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A robust, reusable form for insurance providers to submit quotes, built
// on our standardized form management architecture.
//
// @architectural_notes
// - **Modern Form Management**: This form is powered by 'React Hook Form', our
//   standard for handling all state, validation, and submission logic.
// - **Decoupled API Logic**: The API call is encapsulated in a dedicated
//   'insuranceService' object, separating data logic from the UI.
//
// @todos
// - @free:
//   - [ ] Convert the policy type `<select>` element to a more visually engaging custom radio button group.
// - @premium:
//   - [ ] ✨ Integrate a real-time "Market Rate" display that shows the average quote amount for similar vehicles, helping the insurer make a more competitive bid.
// - @wow:
//   - [ ] 🚀 Add an "Instant Bind" feature where an insurer's quote can be automatically accepted if it meets pre-set criteria from the buyer.
//
// ----------------------------------------------------------------------

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import Button from '@/components/common/Button';
import { theme } from '@/styles/theme';

// Decoupled API Service (conceptual)
const insuranceService = {
  submitQuote: (data: any) => Promise.resolve({ success: true }),
};

// --- Type Definitions ---
type PolicyType = 'Comprehensive' | 'Collision' | 'Liability';
interface IQuoteFormData {
  policyType: PolicyType;
  quoteAmount: number;
  duration: number;
}

// --- The Main Component ---
const QuoteSubmissionForm: React.FC<{ vehicleId: string; onQuoteSubmitted: () => void; }> = ({ onQuoteSubmitted }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IQuoteFormData>();

  const onSubmit: SubmitHandler<IQuoteFormData> = async (data) => {
    try {
      await insuranceService.submitQuote(data);
      toast.success('Quote submitted successfully!');
      onQuoteSubmitted();
    } catch (err) {
      toast.error('Failed to submit quote.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded shadow bg-white">
      <h2 className="text-lg font-semibold">📋 Submit Insurance Quote</h2>
      <select {...register("policyType")} className="w-full border rounded">
          <option value="Comprehensive">Comprehensive</option>
          <option value="Collision">Collision</option>
          <option value="Liability">Liability Only</option>
      </select>
      <input
        {...register("quoteAmount", { required: "Amount is required.", valueAsNumber: true })}
        type="number" placeholder="Quote Amount ($)"
        className="w-full border rounded"
      />
      {errors.quoteAmount && <p className={theme.errorText}>{errors.quoteAmount.message}</p>}
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Quote'}</Button>
    </form>
  );
};

export default QuoteSubmissionForm;