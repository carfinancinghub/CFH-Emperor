// @ai-generated via ai-orchestrator
// The file should be renamed to `Unauthorized.tsx`.

// File: Unauthorized.tsx
// Path: frontend/src/components/auth/Unauthorized.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Since the component takes no props, relying on implicit typing for the function return (JSX.Element) 
// is idiomatic and minimal.
const Unauthorized = () => {
  // TypeScript infers the type of navigate as NavigateFunction from 'react-router-dom'
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Access Denied</h1>
      <p className="text-gray-700 text-lg mb-6">
        You do not have permission to access this page.
      </p>
      {/* The onClick handler correctly uses the inferred navigate function */}
      <Button onClick={() => navigate('/')}>Go to Home</Button>
    </div>
  );
};

export default Unauthorized;