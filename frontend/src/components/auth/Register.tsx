// @ai-generated via ai-orchestrator
// File: Register.tsx
// Path: frontend/src/components/auth/Register.tsx
// Purpose: Basic registration form (typed) that posts to /api/auth/register.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

type UserRole = "buyer" | "seller" | "hauler" | "mechanic" | "insurer" | "admin";

interface RegistrationForm {
  email: string;
  password: string;
  role: UserRole;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegistrationForm>({
    email: "",
    password: "",
    role: "buyer",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/auth/register", form);

      if (response.status === 201 || response.data?.message === "User registered") {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || "Registration failed due to network error.");
      } else {
        setError("An unexpected error occurred during registration.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
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
          <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mt-1">
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
          disabled={success}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
