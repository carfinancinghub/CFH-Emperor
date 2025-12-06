// @ai-generated via ai-orchestrator
This file should be renamed from `Login.js` to `Login.tsx`.

// File: Login.tsx
// Path: frontend/src/components/Login.tsx

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Define the structure for the form state
interface LoginFormState {
  email: string;
  password: string;
}

// 2. Define the expected successful response structure (minimal)
interface LoginResponse {
    token: string;
    role: string;
}

const Login: React.FC = () => {
  // 3. Type state using the interface
  const [form, setForm] = useState<LoginFormState>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  
  const navigate = useNavigate();

  // 4. Type handleChange event handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // We can confidently assert e.target is HTMLInputElement since we only use this handler on inputs
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 5. Type handleSubmit event handler
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      // Axios expects the data type of the response if provided
      const res = await axios.post<LoginResponse>('/api/auth/login', form);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate(`/${res.data.role}`);
      
    } catch (err: unknown) {
      // Use catch (err: unknown) for safety, but maintain the original JS runtime behavior 
      // of setting a generic error message regardless of the error type.
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;