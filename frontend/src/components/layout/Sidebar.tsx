import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export function Sidebar({ isMobileOpen, onClose }: { isMobileOpen?: boolean; onClose?: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/workspace', icon: 'home' },
    { name: 'AI SATHI', path: '/workspace/ai-sathi', icon: 'auto_awesome' },
    { name: 'Hallmarking', path: '/workspace/hallmarking', icon: 'workspace_premium' },
    { name: 'Licensing', path: '/workspace/licensing', icon: 'verified_user' },
    { name: 'Laboratories', path: '/workspace/labs', icon: 'biotech' },
    { name: 'Settings', path: '/workspace/settings', icon: 'settings' }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-surface/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-50 md:relative flex flex-col h-full bg-surface-container-low border-r border-outline-variant transition-transform md:transition-all duration-300
        ${collapsed ? 'md:w-[80px]' : 'md:w-[280px]'}
        w-[280px]
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
      {/* Brand area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-outline-variant">
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <img src="/logomain.png" alt="BIS Logo" className="w-auto h-8 max-w-[120px] object-contain" />
            <div className="flex flex-col">
              <span className="text-[14px] font-bold tracking-wider uppercase text-on-surface">BIS-SATHI</span>
              <span className="text-[10px] text-primary font-medium tracking-widest">WORKSPACE</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <img src="/logomain.png" alt="BIS Logo" className="w-auto h-8 object-contain" />
          </div>
        )}
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-[20px] -right-[12px] w-[24px] h-[24px] bg-surface border border-outline-variant rounded-full flex items-center justify-center text-on-surface hover:text-primary z-10 hidden md:flex shadow-sm"
      >
        <span className="material-symbols-outlined text-[14px]">
          {collapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          // Exact match for /workspace so it doesn't stay active for child routes
          const isActive = item.path === '/workspace' 
            ? location.pathname === '/workspace'
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors group ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <div className="w-6 flex justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
              </div>
              {!collapsed && (
                <span className="text-[14px] font-medium whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
    </>
  );
}
