// ----------------------------------------------------------------------
// File: PhotoEvidenceViewer.tsx
// Path: frontend/src/components/evidence/PhotoEvidenceViewer.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A clean, reusable gallery component for displaying photo evidence with
// specific UI enhancements for premium and Wow++ users.
//
// @usage
// This component is used on pages like delivery details or inspection reports.
// It fetches photo metadata based on a context ID (e.g., a deliveryId).
//
// @architectural_notes
// - **Tier-Aware UI**: This component is a model for how we build tier-aware
//   UI. It conditionally renders extra features (like AI tags or blockchain
//   verification badges) based on the user's plan.
// - **Decoupled Data Logic**: All data fetching is handled by the `usePhotoEvidence`
//   hook, keeping the main component clean and focused on presentation.
//
// @todos
// - @free:
//   - [ ] Add a modal view ("lightbox") to allow users to see a full-size version of the photo when they click on it.
// - @premium:
//   - [ ] ✨ Make the AI-generated tags clickable, allowing users to filter their photos by these tags.
// - @wow:
//   - [ ] 🚀 Clicking the 'Blockchain Verified' badge should open a new tab to a block explorer showing the immutable transaction details.
//
// ----------------------------------------------------------------------

import React from 'react';
import axios from 'axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { theme } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth'; // Our standard auth hook

// --- Type Definitions ---
interface IPhotoEvidence {
  _id: string;
  url: string;
  timestamp: string;
  aiTags?: string[]; // Premium feature
  blockchainTxHash?: string; // Wow++ feature
}

// --- Decoupled Data Hook ---
const usePhotoEvidence = (contextId: string) => {
  const [photos, setPhotos] = React.useState<IPhotoEvidence[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    if (!contextId) return;
    axios.get<IPhotoEvidence[]>(`/api/evidence/photos/${contextId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPhotos(res.data))
      .catch(() => setError('Failed to load photo evidence.'))
      .finally(() => setLoading(false));
  }, [contextId, token]);

  return { photos, loading, error };
};

// --- The Main Component ---
const PhotoEvidenceViewer: React.FC<{ contextId: string }> = ({ contextId }) => {
  const { photos, loading, error } = usePhotoEvidence(contextId);
  const { user } = useAuth(); // Get user plan from our auth hook

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;
  if (photos.length === 0) return <p className="text-gray-500">No photo evidence submitted.</p>;

  return (
    <div className="space-y-6 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">📸 Photo Evidence</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo._id} className="border p-2 rounded bg-gray-50 hover:shadow-lg transition-shadow">
            <img
              src={photo.url}
              alt={`Evidence taken at ${new Date(photo.timestamp).toLocaleString()}`}
              className="rounded w-full h-48 object-cover"
            />
            <div className="p-2">
              <p className="text-sm text-gray-600">
                <strong>Timestamp:</strong> {new Date(photo.timestamp).toLocaleString()}
              </p>
              {/* Premium Feature: AI Tags */}
              {user?.plan === 'premium' && photo.aiTags?.length > 0 && (
                <p className="text-xs text-indigo-600 mt-1 italic">
                  ✨ AI Tags: {photo.aiTags.join(', ')}
                </p>
              )}
              {/* Wow++ Feature: Blockchain Verification */}
              {user?.plan === 'wow++' && photo.blockchainTxHash && (
                 <p className="text-xs text-green-700 mt-1 font-semibold">
                   🚀 Blockchain Verified
                 </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoEvidenceViewer;