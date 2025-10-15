// ----------------------------------------------------------------------
// File: Login.tsx
// Path: frontend/src/pages/auth/Login.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A secure and robust login form for user authentication.
//
// @architectural_notes
// - **Modern Form Management**: This form is powered by 'React Hook Form', our
//   standard for robust, performant, and easily validated forms.
// - **Decoupled API Logic**: All authentication logic is handled by the
//   centralized 'authService', keeping this component clean and focused on UI.
//
// @todos
// - @free:
//   - [ ] Add a "Forgot Password" link that initiates a password reset flow.
// - @premium:
//   - [ ] ✨ Add a "Remember Me" checkbox that extends the user's session duration.
// - @wow:
//   - [ ] 🚀 After a successful login, perform a quick security check and alert the user if their password has been found in a known data breach via a service like "Have I Been Pwned?".
//
// ----------------------------------------------------------------------

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth'; // Our central auth context hook

// --- Form Data Type ---
type LoginFormData = Record<string, any>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from our central auth context
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (formData) => {
    try {
      const { role } = await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate(`/${role}/dashboard`); // Navigate to the role-specific dashboard
    } catch (err) {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            className="w-full px-3 py-2 border rounded-lg mt-1"
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message as string}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            className="w-full px-3 py-2 border rounded-lg mt-1"
          />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message as string}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          {isSubmitting ? 'Logging In...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;