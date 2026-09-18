import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Left side: Form content */}
      <div className="w-full md:w-1/2 lg:w-[480px] flex flex-col min-h-screen bg-surface border-r border-outline-variant shadow-2xl z-10">
        <div className="p-8 flex items-center justify-between border-b border-outline-variant/50">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logomain.png" alt="BIS Logo" className="w-8 h-8 object-contain" />
            <div className="flex flex-col">
              <span className="text-[14px] font-bold tracking-wider uppercase text-on-surface leading-tight">BIS-SATHI</span>
            </div>
          </Link>
          <Link to="/" className="text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 py-8">
          <Outlet />
        </div>
        
        <div className="p-8 text-center border-t border-outline-variant/50">
          <p className="text-[11px] text-on-surface-variant">
            Bureau of Indian Standards &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Right side: Branding / Visual (Hidden on mobile) */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center relative overflow-hidden bg-surface-container-lowest">
        {/* Abstract pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
           style={{ backgroundImage: 'linear-gradient(var(--outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--outline-variant) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        <div className="relative z-10 max-w-lg text-center p-8 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
            <span className="material-symbols-outlined text-[40px] text-primary">security</span>
          </div>
          <h2 className="text-[32px] font-serif-hero text-on-surface leading-tight mb-4">
            Intelligent Information Assistance
          </h2>
          <p className="text-[16px] text-on-surface-variant leading-relaxed">
            Sign in to access your private workspace. Ask questions, find applicable standards, and explore compliance requirements in one secure place.
          </p>
        </div>
      </div>
    </div>
  );
}
