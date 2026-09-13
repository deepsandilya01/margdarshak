import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { EmptyState } from '@/components/feedback/EmptyState';
import { motion } from 'framer-motion';

export default function Notifications() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-8 md:py-12 transition-colors duration-300">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-headline-lg text-on-surface mb-2 tracking-tight">Notifications</h1>
        <p className="text-body-md text-on-surface-variant mb-8">Alerts regarding your compliance journeys, saved standards, and QCO amendments.</p>
        
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden">
          <EmptyState 
            icon="notifications_off" 
            title="You're all caught up" 
            description="You have no new notifications right now. We'll alert you if any of your saved standards are revised or if QCOs are amended." 
          />
        </div>
      </motion.div>
    </div>
  );
}
