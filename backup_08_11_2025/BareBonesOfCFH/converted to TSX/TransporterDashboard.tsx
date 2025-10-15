// ----------------------------------------------------------------------
// File: TransporterDashboard.tsx
// Path: frontend/src/pages/hauler/TransporterDashboard.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive, unified dashboard for the Hauler role. It combines live
// tracking, job status, and core actions into a single, cohesive interface.
//
// @architectural_notes
// - **Consolidated UI**: This component replaces three older, fragmented files,
//   creating a single, maintainable source of truth for the hauler's UI.
// - **Decoupled Data Logic**: All API calls and state management are encapsulated
//   in the `useTransporterJobs` hook, adhering to our core architectural standard.
//
// @todos
// - @free:
//   - [ ] Add filtering and sorting options to the job list.
// - @premium:
//   - [ ] ✨ Display a live map with the hauler's current location and route for each job.
// - @wow:
//   - [ ] 🚀 Integrate the "Smart Delay Predictor" to show an AI-powered prediction of potential delays for each active job.
//
// ----------------------------------------------------------------------

import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

// --- Type Definitions ---
interface ITransporterJob {
  _id: string;
  car: { make: string; model: string; year: number; };
  pickupLocation: string;
  deliveryLocation: string;
  status: string;
}

// --- Decoupled Data & Logic Hook ---
const useTransporterJobs = () => {
  const [jobs, setJobs] = React.useState<ITransporterJob[]>([]);
  const [loading, setLoading] = React.useState(true);
  const token = localStorage.getItem('token');

  const fetchJobs = React.useCallback(async () => {
    try {
      const res = await axios.get('/api/hauler/jobs', { headers: { Authorization: `Bearer ${token}` } });
      setJobs(res.data);
    } catch (err) {
      toast.error('Failed to load transport jobs.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  
  const sendLocationPing = async (jobId: string) => {
    try {
      await axios.post(`/api/hauler/jobs/${jobId}/location`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Location ping sent successfully!');
    } catch (err) {
      toast.error('Failed to send location ping.');
    }
  };

  return { jobs, loading, sendLocationPing };
};


// --- The Main Component ---
const TransporterDashboard: React.FC = () => {
  const { jobs, loading, sendLocationPing } = useTransporterJobs();

  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🚚 Hauler Dashboard & Live Tracking</h1>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No active transport assignments.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <Card key={job._id}>
              <p className="font-bold">{job.car.make} {job.car.model}</p>
              <p><strong>From:</strong> {job.pickupLocation}</p>
              <p><strong>To:</strong> {job.deliveryLocation}</p>
              <p><strong>Status:</strong> {job.status}</p>
              <Button onClick={() => sendLocationPing(job._id)} className="mt-4">
                📍 Send Location Ping
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransporterDashboard;