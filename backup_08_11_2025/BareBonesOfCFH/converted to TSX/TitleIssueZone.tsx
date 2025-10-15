// File: TitleIssueZone.tsx
// Path: frontend/src/components/title/TitleIssueZone.tsx
// Description: A dedicated component to display vehicles with known title issues.

// COMMAND:
// @command: generate-component-suite
// @description: "Generates a full suite of related files for this component: test and documentation."
// @parameters: { "component": "TitleIssueZone", "includeTests": true, "includeDocs": true }

// TODO:
// @free:
//   - [ ] Refactor the data fetching logic to use a dedicated backend endpoint (e.g., GET /api/title/issues) instead of filtering on the client-side. This is critical for performance as the dataset grows.
//   - [ ] Convert this component to use shared 'Card' and 'Button' components for UI consistency with the rest of the application.
// @premium:
//   - [ ] ✨ Add a "Request Information" button that allows institutional buyers to open a support ticket or query for more details on a specific title issue.
//   - [ ] ✨ Show a timeline or history of the title's status changes to provide more context to potential buyers.
// @wow:
//   - [ ] 🚀 Integrate with third-party services that provide vehicle history reports (e.g., CarFax) and display a summary directly on the card.

import React from 'react';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// --- Type Definitions ---
interface TitleRecord {
  _id: string;
  status: 'missing' | 'rejected' | 'pending' | 'clear';
  document?: string;
  carId?: {
    make: string;
    model: string;
    year: number;
  };
  buyerId?: {
    email: string;
  };
}

// --- Component ---
const TitleIssueZone: React.FC = () => {
  const [cars, setCars] = React.useState<TitleRecord[]>([]);
  const [message, setMessage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    const fetchTitleIssues = async () => {
      try {
        const res = await axios.get<TitleRecord[]>(`${process.env.REACT_APP_API_URL}/api/title`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // This filtering should be moved to the backend for performance. See TODO.
        const problemCars = res.data.filter(r => r.status === 'missing' || r.status === 'rejected');
        setCars(problemCars);
      } catch (err) {
        setMessage('❌ Failed to load title-issue cars');
      } finally {
        setLoading(false);
      }
    };
    fetchTitleIssues();
  }, [token]);

  const statusColor = (status: TitleRecord['status']) => {
    switch (status) {
      case 'missing': return 'text-red-600';
      case 'rejected': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold">🚫 Title-Issue Vehicles</h2>
        <p className="text-gray-600 italic mt-2">
          Only verified dealers or institutional buyers can bid on these listings. The title is either missing or legally restricted.
        </p>

        {message && <p className="text-red-500 mt-4">{message}</p>}

        <div className="mt-6 space-y-4">
          {cars.length === 0 && !message ? (
            <p className="text-gray-500">No title-issue vehicles at the moment.</p>
          ) : (
            cars.map((rec) => (
              <div key={rec._id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h4 className="font-bold text-lg">
                  🚗 {rec.carId?.make} {rec.carId?.model} ({rec.carId?.year})
                </h4>
                <p>Status: <strong className={statusColor(rec.status)}>{rec.status.toUpperCase()}</strong></p>
                <p>Buyer: {rec.buyerId?.email || 'Unassigned'}</p>
                {rec.document ? (
                  <img src={rec.document} alt="Proof of Title" className="max-w-full rounded mt-2 border" />
                ) : (
                  <p className="text-gray-500 italic">No title documentation uploaded.</p>
                )}
                <button disabled className="mt-4 px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed">
                  🚫 Bidding Restricted
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleIssueZone;