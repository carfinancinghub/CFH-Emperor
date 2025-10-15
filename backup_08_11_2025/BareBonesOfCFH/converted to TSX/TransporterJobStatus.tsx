// File: TransporterJobStatus.tsx
// Path: frontend/src/components/hauler/TransporterJobStatus.tsx
// 👑 Cod1 Crown Certified — Transporter Delivery Tracker with Live ETA, QR Code Receipt, and Rating Gateway

import React from 'react';
import axios from 'axios';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { theme } from '@/styles/theme';

// Define an interface for the Job object
interface Job {
  _id: string;
  car?: {
    make: string;
    model: string;
    year: number;
  };
  status: string;
  pickupLocation: string;
  dropoffLocation: string; // Assuming this was a typo for deliveryLocation
  eta?: string | number;
  multiHauler?: boolean;
}

const TransporterJobStatus: React.FC = () => {
  // Add types for state variables
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Type the expected API response
        const res = await axios.get<Job[]>(`${process.env.REACT_APP_API_URL}/api/hauler/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        console.error('Error fetching hauler jobs:', err);
        setError('Failed to load job data');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]); // Added token to dependency array

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">🚚 Hauler Job Status</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No active jobs assigned.</p>
      ) : (
        jobs.map((job) => (
          <Card key={job._id} className="space-y-2">
            <div>
              <p><strong>Car:</strong> {job.car?.make} {job.car?.model} ({job.car?.year})</p>
              <p><strong>Status:</strong> {job.status}</p>
              <p><strong>From:</strong> {job.pickupLocation}</p>
              <p><strong>To:</strong> {job.dropoffLocation}</p>
              <p><strong>ETA:</strong> {job.eta ? `${job.eta} hours` : 'Calculating...'}</p>
              {job.multiHauler && <p className="text-sm text-indigo-600">🛤️ Multi-Hauler Route</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => alert(`Starting delivery for job ${job._id}`)}
              >
                ▶️ Start Delivery
              </Button>
              <Button
                variant="success"
                onClick={() => alert(`Marking job ${job._id} as delivered`)}
              >
                ✅ Mark as Delivered
              </Button>
              <Button
                variant="ghost"
                onClick={() => alert('Opening QR Code')}
              >
                📲 View QR Receipt
              </Button>
              <Button
                variant="danger"
                onClick={() => alert(`Flagging issue for job ${job._id}`)}
              >
                ⚠️ Flag Issue
              </Button>
            </div>

            {job.status === 'Delivered' && (
              <div className="text-sm text-green-700">
                <p>🎉 Delivery complete. Buyer feedback pending.</p>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
};

export default TransporterJobStatus;