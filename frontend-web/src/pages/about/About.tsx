import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-8 md:py-16 transition-colors duration-300">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface mb-6 tracking-tight">About BIS-SATHI</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none text-on-surface-variant space-y-6">
          <p className="text-body-lg text-on-surface font-medium leading-relaxed">
            BIS-SATHI is a unified compliance intelligence platform designed to bridge the gap between technical regulatory specifications and real-world manufacturing workflows.
          </p>

          <p>
            Developed as part of the ecosystem modernization initiative, BIS-SATHI aggregates data from the Bureau of Indian Standards (BIS), National Accreditation Board for Testing and Calibration Laboratories (NABL), and various Ministry Quality Control Orders (QCOs) into a single, actionable interface.
          </p>

          <div className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-2xl my-8">
            <h2 className="text-headline-sm text-on-surface mb-4">Core Capabilities</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">search_insights</span>
                <span><strong>Zero Prior Knowledge Discovery:</strong> Find applicable standards without knowing exact codes.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">gavel</span>
                <span><strong>Mandatory Tracking:</strong> Stay updated on active QCOs and gazette notifications.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">science</span>
                <span><strong>Lab Network Integration:</strong> Locate and connect with NABL-accredited facilities.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">auto_awesome</span>
                <span><strong>AI Sathi:</strong> Conversational research assistant for rapid compliance answers.</span>
              </li>
            </ul>
          </div>


        </div>
      </motion.div>
    </div>
  );
}
