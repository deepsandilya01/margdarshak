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
      <footer className="mt-auto w-full bg-gradient-to-b from-[#d5f2dc] via-[#c9ebd2] to-[#bde5c7] text-[#08361b] border-t border-[#9ed1ab] shadow-[0_-6px_20px_rgba(15,107,6,0.1)]">
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
            <p className="text-[13px] leading-5 text-[#134626] font-medium">
              Bureau of Indian Standards Compliance Intelligence Platform
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#8ec79c] bg-[#b1e3be] px-2.5 py-1.5 text-[11px] font-mono text-[#08361b] font-semibold w-fit shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#085a25] animate-pulse-dot" />
              Gazette Vol. 2025/11 · Verified
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 mt-4 md:mt-0">
            {sections.map(section => (
              <div key={section.title} className="border-b border-[#a8d6b4] md:border-none pb-2 md:pb-0">
                <button
                  onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
                  className="flex w-full items-center justify-between py-2 md:py-0 text-left md:cursor-auto"
                >
                  <h4 className="text-[12px] md:text-[11px] font-bold uppercase tracking-[0.14em] text-[#062c16] md:mb-3">
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
                        className="text-[13.5px] md:text-[13px] text-[#124525] transition-colors hover:text-[#041d0e] hover:font-semibold inline-block py-1 md:py-0 font-medium"
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

      <div className="border-t border-[#9ed1ab] bg-[#b6e1c2]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 py-4 text-center sm:flex-row sm:px-6 lg:px-8">
          <p className="text-[11px] md:text-[12px] text-[#0f3d20] font-mono font-medium">
            © {currentYear} BIS-SATHI · Smart India Hackathon 2026 - Team AsyncOrbit
          </p>
          <div className="flex items-center gap-4 text-[12px] text-[#0f3d20]">
            <Link to="/about" className="hover:text-[#041d0e] transition-colors font-semibold">About</Link>
            <Link to="/help" className="hover:text-[#041d0e] transition-colors font-semibold">Help</Link>
            <Link to="/resources" className="hover:text-[#041d0e] transition-colors font-semibold">Resources</Link>
          </div>
        </div>
      </div>
    </footer>
      {/* Tricolor Bar */}
      <div className="h-1.5 w-full tricolor-bar"></div>
    </>
  );
}
