import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function SectionWhatIs({ t }: { t: any }) {
  return (
    <section className="relative w-full py-16 lg:py-24 bg-surface overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-0">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-[32px] md:text-[40px] leading-tight md:leading-[1.15] font-serif-hero text-on-surface mb-4"
          >
            {t('home.whatIsTitle')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-[20px] md:text-[24px] text-primary max-w-3xl mx-auto mb-4"
          >
            {t('home.whatIsSub')}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-[18px] text-on-surface-variant max-w-3xl mx-auto leading-relaxed"
          >
            {t('home.whatIsDesc')}
          </motion.p>
        </div>

        {/* Animated Transformation */}
        <div className="relative w-full max-w-5xl mx-auto h-[400px] flex items-center justify-center perspective-[1000px] mt-12 md:mt-16">
          
          {/* Question Side */}
          <motion.div 
            initial={{ opacity: 0, x: -100, rotateY: 20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-0 md:left-[10%] p-6 rounded-2xl bg-surface-container-low border border-outline-variant shadow-lg max-w-[280px]"
          >
            <p className="text-[16px] text-on-surface italic font-medium leading-relaxed">
              "{t('home.whatIsQ1')}"
            </p>
          </motion.div>

          {/* Central AI Core Processing */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
            className="relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5 backdrop-blur-md shadow-[0_0_40px_rgba(15,107,6,0.1)]"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-secondary/40 border-dashed"
            />
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src="/logo.png" alt="BIS Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain opacity-90 relative z-10" />
            </motion.div>
          </motion.div>

          {/* Connecting Particles */}
          <div className="absolute inset-0 flex justify-between items-center px-[25%] pointer-events-none">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
              className="w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-primary origin-left"
            />
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.2 }}
              className="w-1/3 h-[1px] bg-gradient-to-r from-primary via-primary/50 to-transparent origin-left"
            />
          </div>

          {/* Guidance Side */}
          <motion.div 
            initial={{ opacity: 0, x: 100, rotateY: -20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            className="absolute right-0 md:right-[10%] p-6 rounded-2xl bg-surface-container-lowest border border-primary/20 shadow-xl max-w-[280px]"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
              <span className="text-[14px] font-bold text-on-surface uppercase tracking-wide">Guidance</span>
            </div>
            <div className="w-full space-y-3">
              <div className="h-2 bg-outline-variant/30 rounded-full w-full" />
              <div className="h-2 bg-outline-variant/30 rounded-full w-5/6" />
              <div className="h-2 bg-outline-variant/30 rounded-full w-4/6" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
