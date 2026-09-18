import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SectionMultilingual({ t }: { t: any }) {
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const interval = setInterval(() => {
      setLang(prev => prev === 'en' ? 'hi' : 'en');
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-16 lg:py-24 bg-surface overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-[32px] md:text-[40px] leading-tight md:leading-[1.15] font-serif-hero text-on-surface mb-4"
        >
          {t('home.multiTitle')}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-[18px] text-on-surface-variant max-w-2xl mx-auto mb-16"
        >
          {t('home.multiSub')}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative bg-surface-container-low border border-outline-variant/50 rounded-3xl p-8 md:p-12 shadow-xl max-w-2xl w-full flex items-center justify-center min-h-[160px]"
        >
          {/* Decorative switch indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-outline-variant/50 shadow-sm">
            <span className={`text-[12px] font-bold ${lang === 'en' ? 'text-primary' : 'text-on-surface-variant/50'}`}>EN</span>
            <div className="w-6 h-3 bg-outline-variant/30 rounded-full relative">
              <motion.div 
                animate={{ x: lang === 'en' ? 0 : 12 }} 
                className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full bg-primary"
              />
            </div>
            <span className={`text-[12px] font-bold ${lang === 'hi' ? 'text-primary' : 'text-on-surface-variant/50'}`}>HI</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={lang}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-[20px] md:text-[24px] font-medium text-on-surface"
            >
              "{lang === 'en' ? t('home.multiEn') : t('home.multiHi')}"
            </motion.div>
          </AnimatePresence>

        </motion.div>

      </div>
    </section>
  );
}
