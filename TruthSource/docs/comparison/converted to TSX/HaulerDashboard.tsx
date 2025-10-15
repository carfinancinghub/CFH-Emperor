// File: HaulerDashboard.tsx
// Path: frontend/src/components/hauler/HaulerDashboard.tsx
// 👑 Cod1 Crown Certified — Modern Hauler Dashboard with KPI Stats, GeoPanel, PDF Tool, Badge Tracker, and Navigation

// COMMAND:
// @command: generate-component-suite
// @description: "Generates a full suite of related files for this component: test, storybook, and documentation."
// @parameters: { "component": "HaulerDashboard", "includeTests": true, "includeStorybook": true, "includeDocs": true }

// TODO:
// @free:
//   - [ ] Refactor useState to useReactQuery for robust data fetching, caching, and state management.
//   - [ ] Add basic pagination for the transportation requests list to improve performance with many jobs.
//   - [ ] Improve accessibility by adding aria-live regions for loading/error states and ensuring all controls are keyboard navigable.
// @premium:
//   - [ ] ✨ Implement WebSocket connection for real-time updates on new transportation requests.
//   - [ ] ✨ Add advanced filtering and sorting options for the job list (e.g., by payout, distance, vehicle type).
//   - [ ] ✨ Develop an in-app chat feature for haulers to communicate directly with dispatchers or customers.
// @wow:
//   - [ ] 🚀 Implement an AI-powered "Smart Route" feature that suggests bundling multiple nearby jobs to maximize efficiency and earnings.
//   - [ ] 🚀 Create a predictive earnings analytics page, showing estimated weekly/monthly income based on job history and market trends.
//   - [ ] 🚀 Integrate with fleet telematics systems (e.g., Samsara, Geotab) to provide automatic, real-time location updates without manual pings.

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '@/utils/useAuth';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import HaulerReputationTracker from '@/components/hauler/HaulerReputationTracker';
import HaulerKPIStats from '@/components/hauler/HaulerKPIStats';
import GeoStatusPanel from '@/components/hauler/GeoStatusPanel';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { theme } from '@/styles/theme';

// --- Type Definitions ---
interface TransportationRequest {
  _id: string;
  destination: string;
  vehicle: string;
  // Add any other properties from the API response here
}

// --- Component ---
const HaulerDashboard: React.FC = () => {
  const [requests, setRequests] = React.useState<TransportationRequest[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const token = localStorage.getItem('token');
  const haulerId = localStorage.getItem('userId');
  const { role } = useAuth();

  React.useEffect(() => {
    const fetchRequests = async () => {
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get<TransportationRequest[]>(`${process.env.REACT_APP_API_URL}/api/transportation`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching transportation requests:', err);
        setError('❌ Failed to load transportation requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  const handleAcceptJob = async (requestId: string) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/transportation/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Re-fetch or filter list to reflect the change
      setRequests(prevRequests => prevRequests.filter(req => req._id !== requestId));
    } catch (err) {
      console.error('Error accepting job:', err);
      setError('❌ Failed to accept job');
    }
  };

  const handleDownloadPDF = async (jobId: string) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/hauler/jobs/${jobId}/export-pdf`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DeliveryReport_${jobId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('❌ Could not download delivery PDF.');
    }
  };

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-6 justify-between items-start">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">🚚 Hauler Dashboard</h1>
              <div className="flex flex-wrap gap-4">
                <Link to="/hauler/jobs" className="block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">
                  View My Delivery Jobs
                </Link>
                <Link to="/hauler/history" className="block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded">
                  Job History
                </Link>
                <Link to="/hauler/verify" className="block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
                  Verify Delivery
                </Link>
              </div>
              <HaulerKPIStats haulerId={haulerId} />
              <GeoStatusPanel />
            </div>
            <div className="w-full sm:w-80">
              <HaulerReputationTracker haulerId={haulerId} />
            </div>
          </div>

          {loading && <LoadingSpinner />}
          {error && <p className={theme.errorText}>{error}</p>}
          {!loading && !error && requests.length === 0 && (
            <p className="text-gray-500">No new transportation requests available.</p>
          )}
          {!loading && !error && requests.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="grid">
              {requests.map((req) => (
                <Card key={req._id} className="hover:shadow-md">
                  <div className="space-y-2 p-4" role="gridcell">
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="text-lg font-semibold">{req.destination}</p>
                    <p className="text-sm text-gray-600 mt-2">Vehicle</p>
                    <p className="text-lg font-semibold">{req.vehicle}</p>
                    <div className="flex gap-2 pt-4">
                      <Button variant="primary" onClick={() => handleAcceptJob(req._id)} aria-label={`Accept job ${req._id}`}>
                        Accept Job
                      </Button>
                      <Button variant="secondary" onClick={() => handleDownloadPDF(req._id)}>
                        📄 PDF
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">Current Role: <strong>{role}</strong></p>
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default HaulerDashboard;
```