import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminAuctionOverview } from "./components/admin/AdminAuctionOverview";
import { AIPredictorDashboard } from "./components/ai/AIPredictorDashboard";
import { SmartInsightsWidget } from "./components/ai/SmartInsightsWidget";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SmartInsightsWidget />} />
        <Route path="/admin/auctions" element={<AdminAuctionOverview />} />
        <Route path="/ai/predictor" element={<AIPredictorDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
