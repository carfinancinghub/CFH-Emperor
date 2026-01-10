import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AdminAuctionOverview } from "@/components/admin/AdminAuctionOverview";
import { AIPredictorDashboard } from "@/components/ai/AIPredictorDashboard";
import { SmartInsightsWidget } from "@/components/ai/SmartInsightsWidget";

// Auth flow (Wave-23 Flow-1)
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import Unauthorized from "@/components/auth/Unauthorized";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Royalty flow (Wave-23 Flow-2)
import RoyaltyDashboard from "@/pages/royalty/RoyaltyDashboard";
import RoyaltyAdminPage from "@/pages/admin/royalty/RoyaltyAdminPage";



const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<SmartInsightsWidget />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected examples (Wave-23: wire guards now, real auth later) */}
        <Route
          path="/admin/auctions"
          element={
            <ProtectedRoute>
              <AdminAuctionOverview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai/predictor"
          element={
            <ProtectedRoute>
              <AIPredictorDashboard />
            </ProtectedRoute>
          }
        />
	
	<Route path="/royalty" element={<RoyaltyDashboard />} />

	<Route
	  path="/admin/royalty"
	  element={
 	   <ProtectedRoute>
 	     <RoyaltyAdminPage />
 	   </ProtectedRoute>
 	 }
/>


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
