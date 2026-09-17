import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const sections = [
    {
      title: 'Standards',
      links: [
        { label: 'Browse Standards', to: '/standards' },
        { label: 'Mandatory QCOs', to: '/qco' },
        { label: 'Certification Schemes', to: '/certification' },
        { label: 'Hallmarking', to: '/hallmarking' },
      ],
    },
    {
      title: 'Discover',
      links: [
        { label: 'Product Discovery', to: '/discover' },
        { label: 'Laboratory Finder', to: '/laboratories' },
        { label: 'AI Sathi Research', to: '/ai-sathi' },
        { label: 'Compare Standards', to: '/compare' },
      ],
    },
    {
      title: 'Compliance',
      links: [
        { label: 'Compliance Workspace', to: '/workspace' },
        { label: 'Saved Items', to: '/saved' },
        { label: 'Reports', to: '/reports' },
        { label: 'Resources Library', to: '/resources' },
      ],
    },
    {
      title: 'Help',
      links: [
        { label: 'Consumer Help Center', to: '/help' },
        { label: 'About BIS-SATHI', to: '/about' },
        { label: 'Research History', to: '/history' },
        { label: 'Notifications', to: '/notifications' },
      ],
    },
  ];

  return (
    <>
      <footer className="mt-auto w-full bg-gradient-to-b from-[#eaf5ee] via-[#edf7f0] to-[#e4f2e9] dark:from-[#0d2218] dark:via-[#091a12] dark:to-[#06140e] text-[#143624] dark:text-[#e2f0e7] border-t border-[#c5e4cf] dark:border-[#1a3828] shadow-[0_-8px_24px_rgba(15,107,6,0.06)]">
        {/* Tricolor Bar Top of Footer */}
        <div className="h-1.5 w-full tricolor-bar opacity-90"></div>
        <div className="mx-auto max-w-[1440px] px-4 py-8 md:py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1 flex max-w-sm flex-col gap-5">
              <Link to="/" className="group inline-block w-fit">
                <div className="mb-1 h-16 md:h-20 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/logo.png"
                    alt="BIS-SATHI"
                    className="h-full w-auto object-contain transition-all duration-300"
                  />
                </div>
              </Link>
              <p className="text-[13px] leading-5 text-[#245238] dark:text-[#a0c5b0]">
                Bureau of Indian Standards Compliance Intelligence Platform
              </p>
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#badfc7] dark:border-[#1e4832] bg-[#d7edd0]/70 dark:bg-[#123322]/60 px-2.5 py-1.5 text-[11px] font-mono text-[#14522c] dark:text-[#88d6a5] w-fit shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0f6b06] dark:bg-[#52B548] animate-pulse-dot" />
                Gazette Vol. 2025/11 · Verified
              </div>
            </div>

            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 mt-4 md:mt-0">
              {sections.map(section => (
                <div key={section.title} className="border-b border-[#cce6d5] dark:border-[#1b3d2a] md:border-none pb-2 md:pb-0">
                  <button
                    onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
                    className="flex w-full items-center justify-between py-2 md:py-0 text-left md:cursor-auto"
                  >
                    <h4 className="text-[12px] md:text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d3b22] dark:text-[#a3dfb9] md:mb-3">
                      {section.title}
                    </h4>
                    <span className="material-symbols-outlined text-[18px] text-[#245238] dark:text-[#a0c5b0] md:hidden transition-transform duration-200">
                      {openSection === section.title ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  <ul
                    className={`mt-2 md:mt-0 space-y-2.5 overflow-hidden transition-all duration-300 ${openSection === section.title ? 'max-h-64 opacity-100 mb-4' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'
                      }`}
                  >
                    {section.links.map(link => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="text-[13.5px] md:text-[13px] text-[#245238] dark:text-[#b0d2bf] transition-colors hover:text-[#0b5204] dark:hover:text-[#52b548] inline-block py-1 md:py-0 font-medium"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#c5e4cf] dark:border-[#1a3828] bg-[#dbeee1]/70 dark:bg-[#06140e]/80">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 py-4 text-center sm:flex-row sm:px-6 lg:px-8">
            <p className="text-[11px] md:text-[12px] text-[#2e5941] dark:text-[#8cb89f] font-mono">
              © {currentYear} BIS-SATHI · Smart India Hackathon 2026 - Team AsyncOrbit
            </p>
            <div className="flex items-center gap-4 text-[12px] text-[#2e5941] dark:text-[#8cb89f]">
              <Link to="/about" className="hover:text-[#0b5204] dark:hover:text-[#52b548] transition-colors">About</Link>
              <Link to="/help" className="hover:text-[#0b5204] dark:hover:text-[#52b548] transition-colors">Help</Link>
              <Link to="/resources" className="hover:text-[#0b5204] dark:hover:text-[#52b548] transition-colors">Resources</Link>
            </div>
          </div>
        </div>
      </footer>
      {/* Tricolor Bar */}
    </>
  );
}
