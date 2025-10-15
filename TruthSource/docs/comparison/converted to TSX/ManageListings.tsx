// File: ManageListings.tsx
// Path: frontend/src/pages/seller/ManageListings.tsx
// 👑 Cod1 Crown Certified — A dedicated hub for sellers to manage their inventory.

// TODO:
// @free:
//   - [ ] Add filtering, sorting, and pagination controls to this management page to handle a large number of listings.
// @premium:
//   - [ ] ✨ Display a "Performance Snapshot" (views, bids) next to each listing, fetched from our analytics service.
// @wow:
//   - [ ] 🚀 Create a "Bulk Actions" feature, allowing sellers to select multiple listings and launch them all into auction simultaneously.

import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';

// --- Type Definitions ---
interface IManagedListing {
  _id: string; make: string; model: string; year: number;
  price: number; status: 'Available' | 'Pending Review' | 'In Auction';
  auctionId?: string;
}

// --- Decoupled Data & Logic Hook ---
const useManageableListings = () => {
  const [listings, setListings] = React.useState<IManagedListing[]>([]);
  const [loading, setLoading] = React.useState(true);
  const token = localStorage.getItem('token');

  const fetchListings = React.useCallback(async () => {
    try {
      const res = await axios.get<IManagedListing[]>('/api/seller/listings/manage', { headers: { Authorization: `Bearer ${token}` } });
      setListings(res.data);
    } catch (err) {
      toast.error('Failed to load listings.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const launchAuction = async (carId: string) => {
    try {
      await axios.post('/api/auctions', { carId }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Auction launched successfully!');
      fetchListings(); // Refresh the list to show the new status
    } catch (err) {
      toast.error('Failed to launch auction.');
    }
  };

  return { listings, loading, launchAuction };
};


// --- The Main Component ---
const ManageListings: React.FC = () => {
  const { listings, loading, launchAuction } = useManageableListings();

  if (loading) return <LoadingSpinner />;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Manage My Listings</h1>
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listings.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">You have no listings.</td></tr>
              ) : (
                listings.map(car => (
                  <tr key={car._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{car.year} {car.make} {car.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">${car.price.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{car.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button as={Link} to={`/seller/listings/${car._id}`} variant="secondary" size="sm">View</Button>
                      <Button as={Link} to={`/seller/listings/${car._id}/edit`} variant="secondary" size="sm">Edit</Button>
                      {car.status === 'Available' && (
                        <Button onClick={() => launchAuction(car._id)} variant="success" size="sm">🚀 Launch Auction</Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageListings;