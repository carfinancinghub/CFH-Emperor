// ----------------------------------------------------------------------
// File: Register.tsx
// Path: frontend/src/pages/auth/Register.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A secure, robust, and user-friendly registration form for new users.
//
// @usage
// This component should be used on the public '/register' route. It handles
// user input, client-side validation, and submission to the auth service.
//
// @architectural_notes
// - **Form Management**: This component uses the `React Hook Form` library. This
//   is our standard for all non-trivial forms to handle state, validation,
//   and submission efficiently and performantly.
// - **Security**: Role selection is restricted to public-safe roles only.
//   Admin roles cannot be self-assigned. A password confirmation field with
//   validation is mandatory.
// - **Decoupled Logic**: All API interactions are handled by a dedicated
//   `authService`, keeping the component clean and focused on the UI.
// - **User Feedback**: All success and error messages are displayed using the
//   standardized `toast` notification system.
//
// ----------------------------------------------------------------------

// --- COMMANDS ---
// @command: generate-component-suite
// @description: "Generates a full suite of related files for this component."
// @example: "npm run gen-suite -- --component=Register --includeTests --includeStorybook"

// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Add a password strength indicator to give users real-time feedback.
// @premium:
//   - [ ] ✨ Implement integration with social logins (e.g., Google, GitHub).
// @wow:
//   - [ ] 🚀 Add a check against a service like "Have I Been Pwned?" to prevent users from using compromised passwords.


import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// --- Type Definitions & Configuration ---
type PublicRole = 'buyer' | 'seller' | 'hauler' | 'mechanic' | 'insurer';
type RegisterFormData = Record<string, any>; // Inferred by react-hook-form, can be made more specific

const publicRoles: { value: PublicRole; label: string }[] = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'hauler', label: 'Hauler' },
  { value: 'mechanic', label: 'Mechanic' },
  { value: 'insurer', label: 'Insurer' },
];

// --- ARCHITECTURAL UPGRADE: Decoupled API Service Logic ---
const authService = {
  register: async (data: RegisterFormData) => {
    // In a real app, you might remove 'confirmPassword' before sending
    const { confirmPassword, ...submissionData } = data;
    return axios.post('/api/auth/register', submissionData);
  },
};

// --- The Main Component ---
const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();
  const password = watch('password'); // Watch the password field for the confirmation check

  const onSubmit: SubmitHandler<RegisterFormData> = async (formData) => {
    try {
      await authService.register(formData);
      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Create Your Account</h2>
        
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
            type="email"
            className="w-full px-3 py-2 border rounded-lg mt-1"
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message as string}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
            type="password"
            className="w-full px-3 py-2 border rounded-lg mt-1"
          />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message as string}</p>}
        </div>

        {/* ARCHITECTURAL UPGRADE: Password Confirmation Field */}
        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            {...register("confirmPassword", { required: "Please confirm your password", validate: value => value === password || "Passwords do not match" })}
            type="password"
            className="w-full px-3 py-2 border rounded-lg mt-1"
          />
          {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message as string}</p>}
        </div>

        {/* ARCHITECTURAL UPGRADE: Secure Role Selection */}
        <div>
          <label className="block text-sm font-medium">I am a...</label>
          <select {...register("role")} defaultValue="buyer" className="w-full px-3 py-2 border rounded-lg mt-1">
            {publicRoles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
          {isSubmitting ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;