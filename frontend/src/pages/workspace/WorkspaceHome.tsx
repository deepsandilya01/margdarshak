import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function WorkspaceHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 lg:py-12 flex flex-col gap-8">
        
        {/* Welcome Section */}
        <section className="flex flex-col gap-3">
          <h1 className="font-serif-hero text-[32px] sm:text-[40px] text-primary">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-[15px] sm:text-[16px] text-on-surface-variant max-w-2xl">
            This is your secure BIS-SATHI workspace. Access your personalized AI assistant and manage your settings from here.
          </p>
        </section>

        {/* AI Sathi CTA Card */}
        <section className="mt-4">
          <div className="relative overflow-hidden rounded-2xl bg-surface border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow group flex flex-col sm:flex-row">
            <div className="p-8 sm:p-10 flex flex-col justify-center gap-6 flex-1 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/50 border border-secondary/20 w-fit">
                <span className="material-symbols-outlined text-[16px] text-secondary">auto_awesome</span>
                <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-secondary">INTELLIGENCE ASSISTANT</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <h2 className="font-serif-hero text-[28px] sm:text-[32px] text-primary">AI SATHI</h2>
                <p className="text-[15px] text-on-surface-variant max-w-md leading-relaxed">
                  Start a new conversation to get intelligent assistance with BIS standards, certifications, QCOs, and compliance guidelines.
                </p>
              </div>

              <button 
                onClick={() => navigate('/workspace/ai-sathi')}
                className="mt-2 w-fit flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-medium hover:brightness-110 transition-all shadow-md group-hover:scale-[1.02]"
              >
                <span>Open AI SATHI</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
            
            {/* Decorative Graphic Side */}
            <div className="w-full sm:w-[40%] bg-surface-container-lowest relative overflow-hidden flex items-center justify-center min-h-[200px] sm:min-h-full border-t sm:border-t-0 sm:border-l border-outline-variant/30">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
              <img src="/logomain.png" alt="BIS Logo" className="w-32 h-auto opacity-20 object-contain" />
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="mt-8">
          <h3 className="text-[18px] font-semibold text-on-surface mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => navigate('/workspace/settings')} className="flex items-center gap-4 p-5 rounded-xl bg-surface border border-outline-variant/30 hover:bg-surface-container hover:border-outline-variant transition-colors text-left group">
              <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0 border border-outline-variant/20 group-hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[24px] text-on-surface-variant group-hover:text-primary transition-colors">manage_accounts</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-medium text-on-surface">Account Settings</span>
                <span className="text-[13px] text-on-surface-variant">Manage your profile and preferences</span>
              </div>
            </button>
            
            <button onClick={() => navigate('/')} className="flex items-center gap-4 p-5 rounded-xl bg-surface border border-outline-variant/30 hover:bg-surface-container hover:border-outline-variant transition-colors text-left group">
              <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0 border border-outline-variant/20 group-hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[24px] text-on-surface-variant group-hover:text-primary transition-colors">public</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-medium text-on-surface">Public Portal</span>
                <span className="text-[13px] text-on-surface-variant">Return to the public homepage</span>
              </div>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
