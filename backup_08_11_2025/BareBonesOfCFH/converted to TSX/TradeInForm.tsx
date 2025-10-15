// File: TradeInForm.tsx
// Path: frontend/src/components/trade-in/TradeInForm.tsx
// 👑 Cod1 Crown Certified — Customer-facing vehicle trade-in evaluation form.

// COMMAND:
// @command: generate-component-suite
// @description: "Generates a full suite of related files for this component: test, storybook, and documentation."
// @parameters: { "component": "TradeInForm", "includeTests": true, "includeStorybook": true }

// TODO:
// @free:
//   - [ ] Implement robust form validation using a library like Zod to provide instant feedback on fields like 'Year'.
//   - [ ] Replace the simple text message with a more elegant toast notification system (e.g., react-hot-toast) for feedback.
//   - [ ] Enhance accessibility by adding 'aria-invalid' attributes based on validation state and associating labels with inputs.
// @premium:
//   - [ ] ✨ Integrate with a third-party API (e.g., Kelly Blue Book, Edmunds) to provide real-time, accurate trade-in valuations.
//   - [ ] ✨ Add a file upload feature allowing users to submit photos of their vehicle for a more precise evaluation from staff.
// @wow:
//   - [ ] 🚀 Implement an AI-powered image analysis on user-uploaded photos to automatically detect and report vehicle damage.
//   - [ ] 🚀 Integrate with the user's account to pre-fill the form if they have previously registered a vehicle with the platform.

import React from 'react';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar'; // Assuming Navbar location
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

// --- Type Definitions ---
interface TradeInData {
  make: string;
  model: string;
  year: string;
  condition: string;
}

interface ApiResponse {
  value: number;
}

// --- Component ---
const TradeInForm: React.FC = () => {
  const [formData, setFormData] = React.useState<TradeInData>({
    make: '',
    model: '',
    year: '',
    condition: '',
  });
  const [message, setMessage] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const token = localStorage.getItem('token');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const res = await axios.post<ApiResponse>(
        `${process.env.REACT_APP_API_URL}/api/tradein/evaluate`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ Trade-in value: $${res.data.value.toLocaleString()}`);
    } catch (err) {
      setMessage('❌ Evaluation failed. Please check the details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Trade-In Evaluation</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="make" placeholder="Make (e.g., Toyota)" value={formData.make} onChange={handleChange} required />
          <Input name="model" placeholder="Model (e.g., Camry)" value={formData.model} onChange={handleChange} required />
          <Input name="year" type="number" placeholder="Year (e.g., 2022)" value={formData.year} onChange={handleChange} required />
          <Input name="condition" placeholder="Condition (e.g., Good)" value={formData.condition} onChange={handleChange} required />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Evaluating...' : 'Evaluate My Trade-In'}
          </Button>
        </form>

        {message && (
          <p className={`mt-4 p-3 rounded text-center ${message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default TradeInForm;