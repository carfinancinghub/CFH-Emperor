// File: StorageBidMarketplace.tsx
// Path: frontend/src/components/marketplace/StorageBidMarketplace.tsx
// 👑 Crown Certified Component — A performant and maintainable marketplace UI.

// TODO:
// @free:
//   - [ ] The backend 'GET /api/storage' endpoint should be modified to only return jobs for the authenticated user, removing the need for client-side filtering.
// @premium:
//   - [ ] ✨ Implement real-time updates using WebSockets to show new bids as they arrive without needing a page refresh.
//   - [ ] ✨ Add filtering and sorting options for the user to manage their jobs (e.g., sort by number of bids, filter by vehicle type).
// @wow:
//   - [ ] 🚀 Create a "Compare Bids" view that shows selected bids side-by-side in a detailed comparison table.

import React from 'react';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

// --- Type Definitions ---
interface Bid {
  providerId: string;
  price: number;
  indoor: boolean;
  services: string[];
}

interface StorageJob {
  _id: string;
  status: string;
  carId?: {
    make: string;
    model: string;
    year: number;
  };
  bidHistory: Bid[];
}

// --- Child Component for a single Job Card ---
// By creating a child component, our main component becomes cleaner and more focused.
const StorageJobCard: React.FC<{ job: StorageJob; onAcceptBid: (jobId: string, providerId: string) => void }> = ({ job, onAcceptBid }) => (
  <Card>
    <div className="p-4">
      <h4 className="font-bold text-lg">
        🚗 {job.carId?.make} {job.carId?.model} ({job.carId?.year})
      </h4>
      <p>Status: <strong className="font-semibold">{job.status}</strong></p>

      {job.bidHistory.length === 0 ? (
        <p className="text-gray-500 mt-4">No bids submitted yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          <h5 className="font-semibold text-gray-700">💰 Incoming Bids:</h5>
          {job.bidHistory.map((bid, idx) => (
            <div key={idx} className="border-t pt-3">
              <p><strong className="text-xl">${bid.price.toLocaleString()}</strong> - {bid.indoor ? 'Indoor' : 'Outdoor'} Storage</p>
              <p className="text-sm text-gray-600">Services: {bid.services.join(', ')}</p>
              <Button onClick={() => onAcceptBid(job._id, bid.providerId)} variant="success" className="mt-2">
                ✅ Accept This Bid
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  </Card>
);


// --- Main Marketplace Component ---
const StorageBidMarketplace: React.FC = () => {
  const [jobs, setJobs] = React.useState<StorageJob[]>([]);
  const [message, setMessage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  const token = localStorage.getItem('token');
  const buyerId = localStorage.getItem('userId'); // Note: This should ideally come from the token on the backend

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get<StorageJob[]>(`${process.env.REACT_APP_API_URL}/api/storage`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // TODO: This filter should be removed once the backend sends user-specific data.
        const filtered = res.data; // .filter(j => j.buyerId?._id === buyerId);
        setJobs(filtered);
      } catch (err) {
        setMessage('❌ Failed to load your storage jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]);

  const acceptBid = async (jobId: string, providerId: string) => {
    // Optimistic UI Update: Remove the job from the list immediately for a faster UX.
    const originalJobs = [...jobs];
    setJobs(currentJobs => currentJobs.filter(j => j._id !== jobId));
    setMessage(''); // Clear previous messages

    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/storage/${jobId}/accept`, 
        { providerId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Bid accepted successfully!');
    } catch (err) {
      setMessage('❌ Failed to accept bid. Please refresh and try again.');
      setJobs(originalJobs); // Revert UI change on error
    }
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;

  return (
    <div>
      <Navbar />
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">📦 Storage Auction Bids</h2>
        {message && <p className={message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}>{message}</p>}
        
        {jobs.length === 0 && !message ? (
          <p className="text-gray-500">No active storage auctions for your vehicles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => (
              <StorageJobCard key={job._id} job={job} onAcceptBid={acceptBid} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageBidMarketplace;