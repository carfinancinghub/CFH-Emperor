// File: submitInspectionToBackend.ts
// Path: frontend/src/utils/inspection/submitInspectionToBackend.ts
// Purpose: Type-safe utility for secure submission of inspection data (notes + photo).

// TODO:
// @free:
//   - [ ] Integrate this function into a centralized 'apiClient' that handles token retrieval and headers automatically to reduce boilerplate.
// @premium:
//   - [ ] ✨ Add logic to this function to perform client-side image compression before uploading to save bandwidth and improve speed.

// --- Type Definitions ---
interface InspectionData {
  notes: string;
  photo?: File;
}

interface SubmissionResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Handles the secure submission of mechanic inspection data to the backend.
 * @param jobId The ID of the job being inspected.
 * @param inspectionData An object containing the notes and optional photo file.
 * @param token The JWT for authorization.
 * @returns A promise that resolves to a SubmissionResult object.
 */
export const submitInspection = async (
  jobId: string,
  { notes, photo }: InspectionData,
  token: string
): Promise<SubmissionResult> => {
  const formData = new FormData();
  formData.append('notes', notes);
  if (photo) {
    formData.append('photo', photo, photo.name);
  }

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/mechanic/jobs/${jobId}/inspect`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return { success: true, message: '✅ Inspection submitted successfully', data: res.data };
  } catch (err) {
    console.error('❌ Inspection submission failed:', err);
    // You could add more specific error messages here by inspecting 'err.response.data'
    return { success: false, message: '❌ Submission failed. Please try again.' };
  }
};