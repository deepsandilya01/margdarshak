import React from 'react';
import { Link } from 'react-router-dom';
import { useT as useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation(['common']);

  return (
    <footer className="mt-auto w-full bg-gradient-to-b from-[#eaf5ee] via-[#edf7f0] to-[#e4f2e9] dark:from-[#0d2218] dark:via-[#091a12] dark:to-[#06140e] text-[#143624] dark:text-[#e2f0e7] border-t border-[#c5e4cf] dark:border-[#1a3828]">
      {/* Tricolor Bar Top of Footer */}
      <div className="h-1.5 w-full tricolor-bar opacity-90"></div>
      
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          <div className="flex flex-col gap-4 max-w-sm">
            <Link to="/" className="group inline-block w-fit">
              <div className="h-14 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="BIS-SATHI"
                  className="h-full w-auto object-contain transition-all duration-300"
                />
              </div>
            </Link>
            <p className="text-[14px] leading-relaxed text-[#245238] dark:text-[#a0c5b0]">
              Bureau of Indian Standards <br/> Compliance Intelligence Platform
            </p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="flex flex-col gap-3">
              <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#0d3b22] dark:text-[#a3dfb9]">Platform</h4>
              <Link to="/" className="text-[14px] text-[#245238] dark:text-[#b0d2bf] hover:text-[#0b5204] transition-colors">Home</Link>
              <Link to="/about" className="text-[14px] text-[#245238] dark:text-[#b0d2bf] hover:text-[#0b5204] transition-colors">About AI SATHI</Link>
              <Link to="/" className="text-[14px] text-[#245238] dark:text-[#b0d2bf] hover:text-[#0b5204] transition-colors">How It Works</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#0d3b22] dark:text-[#a3dfb9]">Access</h4>
              <Link to="/login" className="text-[14px] text-[#245238] dark:text-[#b0d2bf] hover:text-[#0b5204] transition-colors">Sign In</Link>
              <Link to="/signup" className="text-[14px] text-[#245238] dark:text-[#b0d2bf] hover:text-[#0b5204] transition-colors">Create Account</Link>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-[#c5e4cf] dark:border-[#1a3828] bg-[#dbeee1]/70 dark:bg-[#06140e]/80">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 py-4 text-center sm:flex-row sm:px-6 lg:px-8">
          <p className="text-[11px] md:text-[12px] text-[#2e5941] dark:text-[#8cb89f] font-mono">
            © {currentYear} BIS-SATHI · Smart India Hackathon 2026 - Team AsyncOrbit
          </p>
          <div className="flex items-center gap-4 text-[12px] text-[#2e5941] dark:text-[#8cb89f]">
            <span>Government of India</span>
            <span>Ministry of Consumer Affairs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
