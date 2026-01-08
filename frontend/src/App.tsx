// File: App.tsx
// Path: C:\CFH\frontend\src\App.tsx
// Purpose: Main app router (Wave-20 hygiene safe baseline)

import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MarketplaceHome from '@/pages/marketplace/MarketplaceHome';
import ListingDetail from '@/pages/marketplace/ListingDetail';
import ListingCreate from '@/pages/marketplace/ListingCreate';
import ListingEdit from '@/pages/marketplace/ListingEdit';
import DealClose from '@/pages/marketplace/DealClose';

const LoadingFallback = () => (
  <div style={{ padding: 16 }}>
    Loading…
  </div>
);

// Lazy pages (keep these minimal; we can expand once core compiles)
const Register = lazy(() => import("./components/auth/Register"));
const Login = lazy(() => import("./components/auth/Login"));

export default function App(): JSX.Element {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/marketplace" element={<MarketplaceHome />} />
        <Route path="/marketplace/create" element={<ListingCreate />} />
        <Route path="/marketplace/listing/:listingId" element={<ListingDetail />} />
        <Route path="/marketplace/listing/:listingId/edit" element={<ListingEdit />} />
        <Route path="/marketplace/deal/:dealId/close" element={<DealClose />} />
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div style={{ padding: 16 }}>404</div>} />
      </Routes>
    </Suspense>
  );
}
