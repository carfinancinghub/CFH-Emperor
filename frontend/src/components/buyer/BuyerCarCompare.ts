// @ai-generated via ai-orchestrator
This component uses JSX syntax, so we will convert it to **TSX** (`.tsx`). We introduce necessary interfaces to define the shape of the data received from the API calls, ensuring type safety throughout the component state and logic.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../common/Navbar';
// Assuming VRViewer is a functional component that accepts props
import VRViewer from './VRViewer';

// --- Interface Definitions ---

interface Badge {
  label: string;
  // Add other known badge properties if needed
}

interface Bid {
  interestRate: number;
}

interface FinancingAuction {
  // Assuming carId is an object reference structure from MongoDB
  carId: { _id: string };
  bidHistory: Bid[];
}

interface Inspection {
  _id: string;
  vrTourUrl?: string; // Optional VR tour URL
  // Add other known inspection properties
}

interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  titleStatus?: string;
  sellerRating?: number | string;
  sellerId: string;
}

// Interface for API response containing badges
interface BadgeResponse {
  badges: Badge[];
}

// --- Component Start ---

const BuyerCarCompare: React.FC = () => {
  // State Initialization with explicit types based on interfaces
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  // Record<string, T> is used for map/dictionary states (Car ID -> Value)
  const [financingOffers, setFinancingOffers] = useState<Record<string, number | null>>({});
  const [sellerBadges, setSellerBadges] = useState<Record<string, Badge[]>>({});
  const [inspections, setInspections] = useState<Record<string, Inspection[]>>({});
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Note: localStorage values are always strings or null
  const token: string | null = localStorage.getItem('token');
  const API_URL: string = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchData = async () => {
      if (!API_URL || !token) {
        setError('Missing configuration or authentication token.');
        setLoading(false);
        return;
      }
      
      setLoading(true);

      try {
        // 1. Fetch Cars
        const carsRes = await axios.get<Car[]>(`${API_URL}/api/cars`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedCars: Car[] = carsRes.data;

        // Configuration for parallel data fetching
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        
        // 2. Fetch Financing Offers
        const financingPromises = fetchedCars.map(async (car) => {
          try {
            const res = await axios.get<FinancingAuction[]>(`${API_URL}/api/financing-auctions/my`, authHeaders);
            
            // Find auction relevant to the current car
            const auction = res.data.find(a => a.carId._id === car._id);

            let lowestRate: number | null = null;
            if (auction && auction.bidHistory.length > 0) {
              lowestRate = Math.min(...auction.bidHistory.map(bid => bid.interestRate));
            }
            return { carId: car._id, lowestInterestRate: lowestRate };
          } catch (err) {
            console.error(`Failed to fetch financing for car ${car._id}`, err);
            return { carId: car._id, lowestInterestRate: null };
          }
        });
        type FinancingResult = { carId: string; lowestInterestRate: number | null };
        const financingData: FinancingResult[] = await Promise.all(financingPromises);
        
        const financingMap = financingData.reduce((acc, data) => {
          acc[data.carId] = data.lowestInterestRate;
          return acc;
        }, {} as Record<string, number | null>);
        setFinancingOffers(financingMap);

        // 3. Fetch Seller Badges
        const badgePromises = fetchedCars.map(async (car) => {
          try {
            const res = await axios.get<BadgeResponse>(`${API_URL}/api/users/${car.sellerId}/badges`, authHeaders);
            return { sellerId: car.sellerId, badges: res.data.badges || [] };
          } catch (err) {
            console.error(`Failed to fetch badges for seller ${car.sellerId}`, err);
            return { sellerId: car.sellerId, badges: [] };
          }
        });
        type BadgeResult = { sellerId: string; badges: Badge[] };
        const badgeData: BadgeResult[] = await Promise.all(badgePromises);
        
        const badgeMap = badgeData.reduce((acc, data) => {
          acc[data.sellerId] = data.badges;
          return acc;
        }, {} as Record<string, Badge[]>);
        setSellerBadges(badgeMap);

        // 4. Fetch Inspections
        const inspectionPromises = fetchedCars.map(async (car) => {
          try {
            const res = await axios.get<Inspection[]>(`${API_URL}/api/inspections/car/${car._id}`, authHeaders);
            return { carId: car._id, inspections: res.data };
          } catch (err) {
            console.error(`Failed to fetch inspections for car ${car._id}`, err);
            return { carId: car._id, inspections: [] };
          }
        });
        type InspectionResult = { carId: string; inspections: Inspection[] };
        const inspectionData: InspectionResult[] = await Promise.all(inspectionPromises);
        
        const inspectionMap = inspectionData.reduce((acc, data) => {
          acc[data.carId] = data.inspections;
          return acc;
        }, {} as Record<string, Inspection[]>);
        setInspections(inspectionMap);

        setCars(fetchedCars);
      } catch (err) {
        // Catch network or major API failure
        setError('❌ Failed to load cars for comparison');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
    else setLoading(false);
  }, [token, API_URL]);

  // Type definition for the car argument
  const toggleSelectCar = (car: Car) => {
    setSelectedCars((prev) =>
      prev.some((c) => c._id === car._id)
        ? prev.filter((c) => c._id !== car._id)
        : [...prev, car].slice(-3) // Limit comparison to 3 cars
    );
  };

  if (loading) return <div className="p-4 text-center">Loading cars...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;
  if (cars.length === 0) return <div className="p-4 text-center">No cars available to compare.</div>;

  return (
    <div className="p-6">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4">🚘 Compare Cars</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {cars.map((car) => {
          // Optional chaining used safely here
          const latestInspection = inspections[car._id]?.[0];
          const vrTourUrl = latestInspection?.vrTourUrl;

          return (
            <div
              key={car._id}
              className={`border p-4 rounded shadow hover:shadow-lg transition ${
                selectedCars.find((c) => c._id === car._id) ? 'border-blue-500' : ''
              }`}
            >
              <h3 className="text-lg font-semibold">{car.make} {car.model} ({car.year})</h3>
              <p className="text-sm">Price: ${car.price.toLocaleString()}</p>
              <p className="text-sm">Mileage: {car.mileage?.toLocaleString() || 'N/A'} mi</p>
              <p className="text-sm">Title: {car.titleStatus || 'Unknown'}</p>
              <p className="text-sm">Seller Rating: {car.sellerRating || 'N/A'}</p>
              <p className="text-sm">
                Seller Badges: {
                  sellerBadges[car.sellerId]?.length
                    ? sellerBadges[car.sellerId].map(b => b.label).join(', ')
                    : 'None'
                }
              </p>
              <p className="text-sm">VR Tour: {vrTourUrl ? '✅ Available' : '❌ Not Available'}</p>
              <button
                onClick={() => toggleSelectCar(car)}
                className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {selectedCars.find((c) => c._id === car._id) ? 'Remove' : 'Compare'}
              </button>
            </div>
          );
        })}
      </div>

      {selectedCars.length >= 2 && (
        <div className="overflow-x-auto border-t pt-4">
          <h3 className="text-xl font-bold mb-2">📊 Comparison Table</h3>
          <table className="min-w-full table-auto text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Metric</th>
                {selectedCars.map((car) => (
                  <th key={car._id} className="border px-2 py-1">
                    {car.make} {car.model}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">Price</td>
                {selectedCars.map((car) => (
                  <td key={car._id} className="border px-2 py-1">${car.price.toLocaleString()}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-2 py-1">Down Payment (20%)</td>
                {selectedCars.map((car) => (
                  <td key={car._id} className="border px-2 py-1">${(car.price * 0.2).toLocaleString()}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-2 py-1">Mileage</td>
                {selectedCars.map((car) => (
                  <td key={car._id} className="border px-2 py-1">{car.mileage?.toLocaleString() || 'N/A'} mi</td>
                ))}
              </tr>
              <tr>
                <td className="border px-2 py-1">Best Interest Rate Offer</td>
                {selectedCars.map((car) => (
                  <td key={car._id} className="border px-2 py-1">
                    {financingOffers[car._id] !== null ? `${financingOffers[car._id]}%` : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border px-2 py-1">Seller Rating</td>
                {selectedCars.map((car) => (
                  <td key={car._id} className="border px-2 py-1">{car.sellerRating || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-2 py-1">Seller Badges</td>
                {selectedCars.map((car) => (
                  <td key={car._id} className="border px-2 py-1">
                    {sellerBadges[car.sellerId]?.length > 0 ? sellerBadges[car.sellerId].map(b => b.label).join(', ') : 'None'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border px-2 py-1">Title Status</td>
                {selectedCars.map((car) => (
                  <td key={car._id} className="border px-2 py-1">{car.titleStatus || 'Unknown'}</td>
                ))}
              </tr>
              <tr>
                <td className="border px-2 py-1">VR Inspection</td>
                {selectedCars.map((car) => {
                  const latestInspection = inspections[car._id]?.[0];
                  // vrTourUrl is guaranteed to be string if present
                  const vrTourUrl = latestInspection?.vrTourUrl; 
                  return (
                    <td key={car._id} className="border px-2 py-1">
                      {vrTourUrl ? (
                        <VRViewer vrTourUrl={vrTourUrl} />
                      ) : 'Not Available'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BuyerCarCompare;