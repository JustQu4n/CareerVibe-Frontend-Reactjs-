/**
 * SuperAdminLayout Component
 * Main layout wrapper for all superadmin pages
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';

export default function SuperAdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SuperAdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: isCollapsed ? '80px' : '280px' }}
      >
        {/* Page Content */}
        <main className="min-h-screen">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
