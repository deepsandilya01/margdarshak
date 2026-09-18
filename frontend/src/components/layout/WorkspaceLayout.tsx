import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import ComparisonTray from '@/features/comparison/components/ComparisonTray';

export function WorkspaceLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Persistent Left Sidebar */}
      <Sidebar isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden min-w-0">
        {/* Top App Bar */}
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface-container-lowest scroll-smooth relative" id="workspace-main" role="main">
          <Outlet />
        </main>
        
        {/* Global comparison tray for the workspace */}
        <ComparisonTray />
      </div>
    </div>
  );
}
