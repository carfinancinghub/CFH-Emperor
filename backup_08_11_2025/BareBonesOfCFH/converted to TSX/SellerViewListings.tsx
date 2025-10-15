// File: SellerViewListings.tsx
// Path: frontend/src/components/seller/SellerViewListings.tsx
// 👑 Cod1 Crown Certified — Decoupled Seller Listing View with a dedicated data hook.

// TODO:
// @free:
//   - [ ] Replace the `window.confirm` with a custom, beautifully styled confirmation modal component for a better user experience.
// @premium:
//   - [ ] ✨ Add a "View Analytics" button that links to a detailed performance dashboard for this specific listing.
// @wow:
//   - [ ] 🚀 Integrate a feature that allows the seller to generate a promotional video for the listing using an AI video creation service.

import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';

// --- Type Definitions ---
interface ICarListing {
  _id: string;
  year: number;
  make: string;
  model: string;
  status: string;
  price: number;
  mileage?: number;
  vin?: string;
  conditionGrade?: string;
  location?: string;
  tags?: string[];
  createdAt: string;
  images?: string[];
  description?: string;
}

// --- ARCHITECTURAL UPGRADE: Decoupled Data & Logic Hook ---
const useSellerListing = (id?: string) => {
  const navigate = useNavigate();
  const [car, setCar] = React.useState<ICarListing | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    if (!id) return;
    const fetchCar = async () => {
      try {
        const res = await axios.get<ICarListing>(`${process.env.REACT_APP_API_URL}/api/seller/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCar(res.data);
      } catch (err) {
        console.error('Error loading listing:', err);
        toast.error('Listing not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, token]);

  const deleteListing = async () => {
    // TODO: Replace with a custom modal component
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/seller/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Listing deleted successfully!');
      navigate('/seller/dashboard'); // Navigate to a more appropriate dashboard page
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete the listing.');
    }
  };

  return { car, loading, deleteListing };
};


// --- The Clean, Presentational Component ---
const SellerViewListings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { car, loading, deleteListing } = useSellerListing(id);

  if (loading) return <LoadingSpinner />;
  if (!car) return <p className="text-red-500 text-center p-8">Listing not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold">🚘 {car.year} {car.make} {car.model}</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/seller/listings/${id}/edit`)}>✏️ Edit</Button>
          <Button variant="danger" onClick={deleteListing}>🗑️ Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p><strong>Status:</strong> <span className="text-blue-600 font-semibold">{car.status}</span></p>
          <p><strong>Price:</strong> ${car.price.toLocaleString()}</p>
          <p><strong>Mileage:</strong> {car.mileage?.toLocaleString() || 'N/A'} miles</p>
          <p><strong>VIN:</strong> {car.vin || 'N/A'}</p>
          <p><strong>Condition:</strong> {car.conditionGrade || 'Unknown'}</p>
          <p><strong>Location:</strong> {car.location || 'Not specified'}</p>
          <p><strong>Tags:</strong> {car.tags?.length ? car.tags.join(', ') : 'None'}</p>
          <p className="text-sm text-gray-500 mt-2"><strong>Listed on:</strong> {new Date(car.createdAt).toLocaleDateString()}</p>
        </div>
        {car.description && (
          <div>
            <h3 className="font-semibold text-lg">📄 Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap mt-1">{car.description}</p>
          </div>
        )}
      </div>

      {car.images?.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-2">📷 Image Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {car.images.map((url, i) => (
              <img key={i} src={url} alt={`Vehicle ${i + 1}`} className="rounded-lg shadow h-40 w-full object-cover" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerViewListings;