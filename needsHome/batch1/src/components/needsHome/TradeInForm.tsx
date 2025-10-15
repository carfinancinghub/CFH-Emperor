import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

type FormData = { make: string; model: string; year: string; condition: string };

const TradeInForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ make: '', model: '', year: '', condition: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') ?? '';
      const base = (import.meta as any)?.env?.VITE_API_URL ?? process.env.REACT_APP_API_URL ?? '';
      const res = await axios.post(
        `${base}/api/tradein/evaluate`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ Trade-in value: $${res.data?.value ?? ''}`);
    } catch (err) {
      console.error(err);
      setMessage('✖ Evaluation failed');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Trade-In Evaluation</h1>
        {message && <p className="mb-4 text-sm text-red-600">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text" placeholder="Make" className="w-full p-2 mb-2 border rounded"
            value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          />
          <input
            type="text" placeholder="Model" className="w-full p-2 mb-2 border rounded"
            value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          />
          <input
            type="number" placeholder="Year" className="w-full p-2 mb-2 border rounded"
            value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
          <input
            type="text" placeholder="Condition" className="w-full p-2 mb-2 border rounded"
            value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Evaluate Trade-In</button>
        </form>
      </div>
    </div>
  );
};

export default TradeInForm;
