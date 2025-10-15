// File: Sidebar.tsx
// Path: frontend/src/components/layout/Sidebar.tsx
// Purpose: Renders the main application navigation sidebar.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — Decoupled, type-safe, and reusable by design.

// TODO:
// @free:
//   - [ ] Move the `navigationConfig` object into its own dedicated file (e.g., `src/config/navigation.ts`) to fully decouple it.
//   - [ ] Implement a 'useAuth()' hook that provides the user object and logout function, centralizing all authentication logic.
//   - [ ] Add icons to each navigation link for a richer user experience.

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// --- Type Definitions ---
type Role = 'admin' | 'seller' | 'buyer' | 'hauler' | 'guest';
interface UserProfile {
  email: string;
  role: Role;
}
interface NavLinkItem {
  label: string;
  path: string;
}

// --- ARCHITECTURAL UPGRADE: Decoupled Navigation Configuration ---
// This configuration should be moved to a dedicated file (e.g., /config/navigation.ts)
const navigationConfig: Record<Role, NavLinkItem[]> = {
  guest: [],
  admin: [
    { label: 'Admin Home', path: '/admin' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Disputes', path: '/admin/disputes' },
    { label: 'Auctions', path: '/admin/auctions' },
  ],
  seller: [{ label: 'My Cars', path: '/dashboard/my-cars' }],
  buyer: [{ label: 'Buy Cars', path: '/dashboard/buy-cars' }],
  hauler: [{ label: 'Hauler Jobs', path: '/hauler-dashboard' }],
};
const commonLinks: NavLinkItem[] = [{ label: 'Dashboard', path: '/dashboard' }];

// --- Component Definition ---
interface SidebarProps {
  user: UserProfile | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const roleLinks = user ? navigationConfig[user.role] : [];
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4 shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 border-b border-gray-700 pb-4">
        🚗 CarHub
      </h2>
      
      {user && (
        <div className="text-center mb-6 p-2 bg-gray-700 rounded-lg">
          <p className="font-semibold">👤 {user.email}</p>
          <p className="text-xs text-gray-400 capitalize">{user.role}</p>
        </div>
      )}

      <nav className="flex-grow space-y-2">
        {[...commonLinks, ...roleLinks].map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => 
              `block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${isActive ? 'bg-blue-600' : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogoutClick}
        className="mt-6 w-full py-2.5 px-4 rounded bg-red-600 hover:bg-red-700 transition duration-200"
      >
        🔓 Logout
      </button>
    </div>
  );
};

export default Sidebar;