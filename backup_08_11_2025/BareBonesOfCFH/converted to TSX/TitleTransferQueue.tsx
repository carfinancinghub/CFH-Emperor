// File: TitleTransferQueue.tsx
// Path: frontend/src/components/title/TitleTransferQueue.tsx
// 👑 Cod1 Crown Certified — Administrative tool for processing vehicle title transfers.

// COMMAND:
// @command: generate-component-suite
// @description: "Generates a full suite of related files for this component: test, storybook, and documentation."
// @parameters: { "component": "TitleTransferQueue", "includeTests": true, "includeDocs": true }

// TODO:
// @free:
//   - [ ] Implement a search and filter bar to quickly find transfers by VIN, Buyer Email, or Escrow ID.
//   - [ ] Add a confirmation modal ('Are you sure you want to complete this transfer?') to prevent accidental clicks.
//   - [ ] Implement pagination for the queue to handle large numbers of pending transfers efficiently.
// @premium:
//   - [ ] ✨ Allow for bulk processing of transfers (e.g., select multiple and mark them all as complete).
//   - [ ] ✨ Integrate with a digital signature service (e.g., DocuSign) to manage required documents directly from this interface.
//   - [ ] ✨ Send automated email notifications to the buyer and seller once a transfer is marked as complete.
// @wow:
//   - [ ] 🚀 Build a direct integration with state DMV APIs to submit and track title transfers electronically, minimizing manual work.
//   - [ ] 🚀 Utilize a blockchain ledger to create a secure, immutable, and auditable history of every title transfer.

import React from 'react';
import axios from 'axios';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { theme } from '@/styles/theme';

// --- Type Definitions ---
interface TransferItem {
  _id: string;
  vin?: string;
  vehicleId?: string;
  buyer?: {
    email: string;
  };
  escrowId: string;
}

// --- Component ---
const TitleTransferQueue: React.FC = () => {
  const [queue, setQueue] = React.useState<TransferItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await axios.get<TransferItem[]>(
          `${process.env.REACT_APP_API_URL}/api/title/transfers/pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQueue(res.data);
      } catch (err) {
        console.error('Error fetching title queue:', err);
        setError('❌ Failed to load title transfer queue');
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, [token]); // Added token to dependency array for correctness

  const handleComplete = async (id: string) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/title/transfers/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optimistically update the UI for a faster user experience
      setQueue(prevQueue => prevQueue.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to mark transfer complete:', err);
      alert('Error updating status. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🚗 Title Transfer Queue</h1>
      {error && <p className={theme.errorText}>{error}</p>}
      
      {!error && queue.length === 0 && (
        <p className="text-gray-500 text-center py-10">No pending transfers found.</p>
      )}

      {!error && queue.length > 0 && (
        <ul className="space-y-4">
          {queue.map((item) => (
            <li key={item._id} className="border rounded-lg p-4 shadow-sm bg-white flex justify-between items-center">
              <div>
                <p><strong>Vehicle VIN:</strong> {item.vin || item.vehicleId || 'N/A'}</p>
                <p><strong>Buyer:</strong> {item.buyer?.email || 'N/A'}</p>
                <p><strong>Escrow ID:</strong> {item.escrowId}</p>
              </div>
              <Button onClick={() => handleComplete(item._id)} variant="success">
                ✅ Mark Complete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TitleTransferQueue;