import React from 'react';
import { Navigate } from 'react-router-dom';
import BuyerDashboard from '../components/BuyerDashboard';
import SellerDashboard from '../components/SellerDashboard';
import LenderDashboard from '../components/LenderDashboard';
import MechanicDashboard from '../components/MechanicDashboard';
import AdminDashboard from '../components/AdminDashboard';

const RoleRouter = ({ role }) => {
  switch (role) {
    case 'buyer': return <BuyerDashboard />;
    case 'seller': return <SellerDashboard />;
    case 'lender': return <LenderDashboard />;
    case 'mechanic': return <MechanicDashboard />;
    case 'admin': return <AdminDashboard />;
    default: return <Navigate to="/unauthorized" />;
  }
};

export default RoleRouter;
