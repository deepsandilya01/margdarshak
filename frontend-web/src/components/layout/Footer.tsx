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
      <footer className="mt-auto w-full bg-gradient-to-br from-[#0a2b1d] via-[#0d3324] to-[#081f16] text-white shadow-[0_-12px_30px_rgba(8,23,17,0.12)]">
      {/* Tricolor Bar Top of Footer */}
      <div className="h-1.5 w-full tricolor-bar opacity-80"></div>
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1 flex max-w-sm flex-col gap-5">
            <Link to="/" className="group inline-block w-fit">
              <div className="mb-1 h-16 md:h-20 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="BIS-SATHI"
                  className="h-full w-auto object-contain drop-shadow-lg group-hover:drop-shadow-[0_0_12px_rgba(230,92,0,0.5)] transition-all duration-300"
                />
              </div>
            </Link>
            <p className="text-[13px] leading-5 text-white/70">
              Bureau of Indian Standards Compliance Intelligence Platform
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-mono text-white/80 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-[#52B548] animate-pulse-dot" />
              Gazette Vol. 2025/11 · Verified
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 mt-4 md:mt-0">
            {sections.map(section => (
              <div key={section.title} className="border-b border-white/10 md:border-none pb-2 md:pb-0">
                <button
                  onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
                  className="flex w-full items-center justify-between py-2 md:py-0 text-left md:cursor-auto"
                >
                  <h4 className="text-[12px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 md:text-white/55 md:mb-3">
                    {section.title}
                  </h4>
                </button>
                <ul
                  className={`mt-2 md:mt-0 space-y-2.5 overflow-hidden transition-all duration-300 ${
                    openSection === section.title ? 'max-h-64 opacity-100 mb-4' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'
                  }`}
                >
                  {section.links.map(link => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-[13.5px] md:text-[13px] text-white/70 transition-colors hover:text-white inline-block py-1 md:py-0"
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

      <div className="border-t border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 py-4 text-center sm:flex-row sm:px-6 lg:px-8">
          <p className="text-[11px] md:text-[12px] text-white/55 font-mono">
            © {currentYear} BIS-SATHI · Smart India Hackathon 2026 - Team AsyncOrbit
          </p>
          <div className="flex items-center gap-4 text-[12px] text-white/60">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/help" className="hover:text-white transition-colors">Help</Link>
            <Link to="/resources" className="hover:text-white transition-colors">Resources</Link>
          </div>
        </div>
      </div>
    </footer>
      {/* Tricolor Bar */}
      <div className="h-1.5 w-full tricolor-bar"></div>
    </>
  );
}
