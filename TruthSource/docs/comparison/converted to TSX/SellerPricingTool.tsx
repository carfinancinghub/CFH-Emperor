// File: SellerPricingTool.tsx
// Path: frontend/src/components/seller/SellerPricingTool.tsx
// 👑 Cod1 Crown Certified — A reusable, "live" pricing widget powered by a debounce hook.

// TODO:
// @free:
//   - [ ] Add a visual cue, like a subtle spinner inside the input fields, to indicate that a debounced search is in progress.
// @premium:
//   - [ ] ✨ Enhance the 'getSuggestedPrice' API to accept more parameters (e.g., mileage, condition) for a more accurate suggestion.
// @wow:
//   - [ ] 🚀 Use this component to power a "Price Watch" feature, allowing sellers to subscribe to real-time price fluctuation notifications for a specific vehicle model.

import React from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

// --- ARCHITECTURAL UPGRADE: Reusable Debounce Hook ---
// This hook can be moved to a shared 'hooks' directory and used anywhere in the app.
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

// --- ARCHITECTURAL UPGRADE: Decoupled API Logic ---
interface PriceSuggestion {
  suggestedPrice: number;
}
const getSuggestedPrice = async (make: string, model: string, year: string, token: string | null): Promise<PriceSuggestion> => {
  if (!make || !model || !year) {
    return Promise.reject(new Error('Make, model, and year are required.'));
  }
  const res = await fetch(`/api/listings/suggest-price?make=${make}&model=${model}&year=${year}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch price data from the server.');
  }
  return res.json();
};


// --- The Reusable Component ---
interface SellerPricingToolProps {
  onPriceSuggested?: (price: number) => void;
}

const SellerPricingTool: React.FC<SellerPricingToolProps> = ({ onPriceSuggested }) => {
  const [make, setMake] = React.useState('');
  const [model, setModel] = React.useState('');
  const [year, setYear] = React.useState('');
  
  const [suggestedPrice, setSuggestedPrice] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);
  const token = localStorage.getItem('token');

  // Use the debounce hook on the input values
  const debouncedMake = useDebounce(make, 500);
  const debouncedModel = useDebounce(model, 500);
  const debouncedYear = useDebounce(year, 500);

  React.useEffect(() => {
    if (debouncedMake && debouncedModel && debouncedYear) {
      setLoading(true);
      getSuggestedPrice(debouncedMake, debouncedModel, debouncedYear, token)
        .then(data => {
          setSuggestedPrice(data.suggestedPrice);
          if (onPriceSuggested) {
            onPriceSuggested(data.suggestedPrice);
          }
        })
        .catch(err => toast.error(err.message))
        .finally(() => setLoading(false));
    }
  }, [debouncedMake, debouncedModel, debouncedYear, token, onPriceSuggested]);

  return (
    <div className="p-4 bg-white shadow rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">💡 Seller Pricing Suggestion Tool</h2>
      <div className="space-y-3">
        <Input placeholder="Car Make (e.g., Toyota)" value={make} onChange={(e) => setMake(e.target.value)} />
        <Input placeholder="Car Model (e.g., Camry)" value={model} onChange={(e) => setModel(e.target.value)} />
        <Input type="number" placeholder="Year (e.g., 2020)" value={year} onChange={(e) => setYear(e.target.value)} />
      </div>

      <div className="mt-4 h-16">
        {loading && <p className="text-gray-500">Analyzing market data...</p>}
        {suggestedPrice && !loading && (
          <div className="bg-green-100 border-l-4 border-green-500 p-3 rounded text-green-800">
            Suggested Listing Price: <strong>${suggestedPrice.toLocaleString()}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPricingTool;