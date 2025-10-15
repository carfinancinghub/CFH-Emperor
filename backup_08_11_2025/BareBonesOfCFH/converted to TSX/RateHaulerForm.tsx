// ----------------------------------------------------------------------
// File: RateHaulerForm.tsx
// Path: frontend/src/components/reviews/RateHaulerForm.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A robust, reusable form for rating haulers, built with a custom,
// componentized star rating input.
//
// @usage
// Import and render in any component where a hauler rating is needed.
// e.g., `<RateHaulerForm jobId="job-123" />`
//
// @architectural_notes
// - **True Reusability (`<StarRatingInput />`)**: We have extracted the star
//   rating UI and logic into its own reusable component. It is designed to
//   integrate perfectly with React Hook Form via the `<Controller>` component.
//   This is our new standard for creating custom, reusable form inputs.
// - **Advanced Form Management**: The main form uses `React Hook Form` to
//   handle state, validation, and submission, aligning with our application-wide
//   standard for robust forms.
//
// ----------------------------------------------------------------------

import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import Button from '@/components/common/Button';

// --- ARCHITECTURAL UPGRADE: A Truly Reusable, Composable Form Input Component ---
interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}
const StarRatingInput: React.FC<StarRatingInputProps> = ({ value, onChange }) => (
  <div className="flex items-center space-x-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => onChange(star)}
        className={`text-3xl cursor-pointer transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
        role="button"
        aria-label={`Rate ${star} stars`}
      >★</span>
    ))}
  </div>
);

// --- Type Definitions ---
interface FormData {
  rating: number;
  feedback: string;
}

// --- Main Form Component ---
const RateHaulerForm: React.FC<{ jobId: string }> = ({ jobId }) => {
  const [submitted, setSubmitted] = React.useState(false);
  const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: { rating: 0, feedback: '' }
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // API call logic would be decoupled here, e.g., `await api.submitHaulerReview(jobId, data)`
      console.log('Submitting review:', { jobId, ...data });
      toast.success('Thank you! Your review has been submitted.');
      setSubmitted(true);
    } catch (err) {
      toast.error('Failed to submit review. Please try again.');
    }
  };

  if (submitted) {
    return <p className="text-green-600 p-4 bg-green-50 rounded">✅ Thank you! Your rating has been submitted.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded bg-gray-50 mt-6">
      <h3 className="text-lg font-semibold mb-2">⭐ Rate Your Hauler</h3>
      
      {/* ARCHITECTURAL UPGRADE: Integrating the custom input with React Hook Form */}
      <Controller
        name="rating"
        control={control}
        rules={{ validate: (value) => value > 0 || 'Please select a rating.' }}
        render={({ field }) => <StarRatingInput value={field.value} onChange={field.onChange} />}
      />
      {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}

      <textarea
        {...control.register("feedback")}
        placeholder="Optional feedback..."
        className="w-full border rounded p-2 text-sm mt-3 mb-3"
        rows={3}
      />
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default RateHaulerForm;