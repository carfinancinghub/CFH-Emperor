// @ai-generated via ai-orchestrator
This conversion retains the original component logic, uses modern React TypeScript conventions (`React.FC`), defines explicit types for the state (especially the complex form object), and uses `axios.isAxiosError` for robust error handling.

The file should be renamed to `Register.tsx`.

// File: Register.tsx
// Path: frontend/src/components/Register.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

// --- Type Definitions ---

type UserRole = 'buyer' | 'seller' | 'hauler' | 'mechanic' | 'insurer' | 'admin';

interface RegistrationForm {
  email: string;
  password: string;
  role: UserRole;
}

const Register: React.FC = () => {
  // 🧠 Debug log — confirms route hit
  console.log("🔍 Register component loaded");

  const navigate = useNavigate();

  const [form, setForm] = useState<RegistrationForm>({
    email: '',
    password: '',
    role: 'buyer', // Default role
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  /**
   * Handles changes for both input (email/password) and select (role) elements.
   * Uses a union type for the event target.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    try {
      // Axios automatically infers response structure based on common usage,
      // but we don't need to define a specific success interface here.
      const response = await axios.post('/api/auth/register', form);
      
      if (response.status === 201 || response.data.message === 'User registered') {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      // Use axios.isAxiosError to safely narrow the type of the error object
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Registration failed due to network error.');
      } else {
        setError('An unexpected error occurred during registration.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg mt-1"
          >
            {/* Explicitly casting values as UserRole where necessary, 
                though TS usually handles literal types here */}
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="hauler">Hauler</option>
            <option value="mechanic">Mechanic</option>
            <option value="insurer">Insurer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">Registered! Redirecting...</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={success} // Prevent double submission while redirecting
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;