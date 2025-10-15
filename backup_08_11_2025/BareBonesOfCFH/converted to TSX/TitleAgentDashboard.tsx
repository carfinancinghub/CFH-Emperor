// ----------------------------------------------------------------------
// File: TitleAgentDashboard.tsx
// Path: frontend/src/pages/admin/TitleAgentDashboard.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive, unified dashboard for the Title Agent role. It combines
// the pending transfer queue with search and action controls.
//
// @architectural_notes
// - **Consolidated UI**: This component replaces two older, fragmented files,
//   creating a single, maintainable source of truth for the title agent's UI.
// - **Decoupled Data Logic**: All API calls and state management are encapsulated
//   in the `useTitleTransfers` hook, adhering to our core architectural standard.
//
// @todos
// - @free:
//   - [ ] Add a confirmation modal before an agent completes a transfer to prevent accidental clicks.
// - @premium:
//   - [ ] ✨ Add a "batch actions" feature allowing agents to approve multiple transfers at once.
// - @wow:
//   - [ ] 🚀 Integrate an AI-powered "risk score" for each transfer, flagging items with potential issues based on historical data.
//
// ----------------------------------------------------------------------

import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

// --- Type Definitions ---
interface ITitleTransfer {
  _id: string;
  vin: string;
  buyer: { email: string };
  escrowId: string;
}

// --- Decoupled Data & Logic Hook ---
const useTitleTransfers = () => {
  const [transfers, setTransfers] = React.useState<ITitleTransfer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const token = localStorage.getItem('token');

  const fetchTransfers = React.useCallback(async () => {
    try {
      const res = await axios.get('/api/title/transfers/pending', { headers: { Authorization: `Bearer ${token}` } });
      setTransfers(res.data);
    } catch (err) {
      toast.error('Failed to load pending transfers.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const completeTransfer = async (id: string) => {
    setTransfers(prev => prev.filter(t => t._id !== id)); // Optimistic update
    try {
      await axios.post(`/api/title/transfers/${id}/complete`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Transfer marked as complete!');
    } catch (err) {
      toast.error('Failed to complete transfer.');
      fetchTransfers(); // Revert on error
    }
  };

  return { transfers, loading, completeTransfer };
};

// --- The Main Component ---
const TitleAgentDashboard: React.FC = () => {
  const { transfers, loading, completeTransfer } = useTitleTransfers();

  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🚗 Title Transfer Queue</h1>
      {transfers.length === 0 ? (
        <p className="text-gray-500">No pending transfers.</p>
      ) : (
        <ul className="space-y-4">
          {transfers.map(item => (
            <Card key={item._id}>
              <p><strong>Vehicle VIN:</strong> {item.vin}</p>
              <p><strong>Buyer:</strong> {item.buyer?.email || 'N/A'}</p>
              <Button onClick={() => completeTransfer(item._id)}>✅ Mark Complete</Button>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TitleAgentDashboard;