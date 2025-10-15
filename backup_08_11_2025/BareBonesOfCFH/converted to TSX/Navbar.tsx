// ----------------------------------------------------------------------
// File: Navbar.tsx
// Path: frontend/src/components/layout/Navbar.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:12 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive, unified, and responsive navigation bar for the entire
// application. It adapts seamlessly between desktop and mobile views.
//
// @architectural_notes
// - **Unified Responsive Component**: Replaces two separate files with a single,
//   maintainable component. This is our standard for creating responsive UI.
// - **Centralized State**: Consumes the 'useAuth' and 'useNotifications' hooks
//   to get its data, ensuring it is always in sync with the rest of the app.
//
// @todos
// - @free:
//   - [ ] Add the company logo to the far-left link.
// - @premium:
//   - [ ] ✨ Allow users to customize the links that appear in their navbar for quick access.
// - @wow:
//   - [ ] 🚀 Implement a "Command Palette" (Ctrl+K) for keyboard-based navigation, accessible from the navbar.
//
// ----------------------------------------------------------------------

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => (
    <div className={isMobile ? "space-y-2 mt-4" : "flex items-center gap-4"}>
      {user?.role === 'seller' && <Link to="/seller/dashboard">Seller Dashboard</Link>}
      {user?.role === 'admin' && <Link to="/admin/dashboard">Admin Panel</Link>}
      <Link to="/notifications" className="relative flex items-center gap-1">
        <Bell size={18} /> Notifications
        {unreadCount > 0 && 
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        }
      </Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );

  return (
    <nav className="bg-indigo-700 text-white px-6 py-3 shadow-md">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Car Financing Hub</Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex">
          <NavLinks />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4">
          <NavLinks isMobile />
        </div>
      )}
    </nav>
  );
};

export default Navbar;