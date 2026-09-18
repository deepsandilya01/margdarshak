import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 w-full bg-surface border-b border-outline-variant flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
      
      {/* Left side: Context/Title or Search */}
      <div className="flex-1 max-w-xl flex items-center gap-3">
        <button 
          className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors" 
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        
        <div className="relative group hidden sm:flex items-center flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">search</span>
          <input 
            type="text" 
            placeholder="Search AI SATHI..." 
            className="w-full h-10 bg-surface-container-low border border-transparent rounded-full pl-10 pr-4 text-[14px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:bg-surface transition-all"
          />
        </div>
      </div>

      {/* Right side: User actions */}
      <div className="flex items-center gap-4 ml-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors relative">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>

        <div className="w-[1px] h-6 bg-outline-variant mx-2"></div>

        <div className="flex items-center gap-3 group relative cursor-pointer">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-[13px] font-semibold text-on-surface">{user?.name || 'User'}</span>
            <span className="text-[11px] text-on-surface-variant uppercase tracking-wider">{user?.role || 'User'}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[14px] border border-primary/20">
            {user?.name?.charAt(0) || 'U'}
          </div>

          {/* Minimal dropdown menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-low border border-outline-variant rounded-xl shadow-lg opacity-0 invisible scale-95 group-hover:scale-100 group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
            <div className="py-2 flex flex-col">
              <div className="px-4 py-2 border-b border-outline-variant mb-2 md:hidden">
                <p className="text-[13px] font-semibold text-on-surface">{user?.name}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{user?.email}</p>
              </div>
              <button onClick={() => navigate('/workspace/settings')} className="flex items-center gap-3 px-4 py-2 text-[13px] text-on-surface hover:bg-surface-container-high w-full text-left">
                <span className="material-symbols-outlined text-[18px]">person</span> Profile
              </button>
              <button onClick={() => navigate('/workspace/settings')} className="flex items-center gap-3 px-4 py-2 text-[13px] text-on-surface hover:bg-surface-container-high w-full text-left">
                <span className="material-symbols-outlined text-[18px]">settings</span> Settings
              </button>
              <div className="h-[1px] bg-outline-variant my-1"></div>
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-[13px] text-error hover:bg-error/10 w-full text-left">
                <span className="material-symbols-outlined text-[18px]">logout</span> Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
