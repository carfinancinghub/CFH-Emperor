// File: TransporterLiveTracking.tsx
// Path: frontend/src/components/hauler/TransporterLiveTracking.tsx

import React, 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/layout/AdminLayout';
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
  pickupLocation: string;
  deliveryLocation: string;
  status: string;
}

const TransporterLiveTracking: React.FC = () => {
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
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(res.data);
      } catch (err) {
        console.error('Error loading transport jobs:', err);
        setError('❌ Failed to load transport jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]); // Added token to dependency array

  // Add type for the jobId parameter
  const handleLocationPing = async (jobId: string) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/hauler/jobs/${jobId}/location`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('📍 Location ping sent successfully!');
    } catch (err) {
      console.error('Failed to send location update:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🚚 Live Transport Tracker</h1>

        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText}>{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-gray-500">No active transport assignments.</p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => (
              <Card key={job._id}>
                <p className="text-sm text-gray-600">Vehicle:</p>
                <p className="font-bold">{job.car?.make} {job.car?.model} ({job.car?.year})</p>
                <p className="text-sm text-gray-600 mt-2">Pickup:</p>
                <p>{job.pickupLocation}</p>
                <p className="text-sm text-gray-600 mt-2">Delivery:</p>
                <p>{job.deliveryLocation}</p>
                <p className="text-sm text-gray-600 mt-2">Status:</p>
                <p className="font-semibold">{job.status}</p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => handleLocationPing(job._id)}
                >
                  Send Location Ping
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TransporterLiveTracking;