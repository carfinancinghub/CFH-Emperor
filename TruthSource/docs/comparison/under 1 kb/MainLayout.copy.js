// File: MainLayout.js
// Path: src/components/layout/MainLayout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 shadow bg-white">
        <Navbar />
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
