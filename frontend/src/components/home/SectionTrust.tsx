import React from 'react';
import { motion } from 'framer-motion';

export default function SectionTrust({ t }: { t: any }) {
  const points = [
    { icon: 'verified', text: t('home.trustPoint1') },
    { icon: 'forum', text: t('home.trustPoint2') },
    { icon: 'psychology', text: t('home.trustPoint3') },
    { icon: 'library_books', text: t('home.trustPoint4') },
    { icon: 'translate', text: t('home.trustPoint5') }
  ];

  return (
    <section className="relative w-full py-16 lg:py-24 bg-surface-container-low border-y border-outline-variant/30 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-16">
        
        {/* TEXT */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-[32px] md:text-[40px] leading-tight md:leading-[1.15] font-serif-hero text-on-surface mb-12 max-w-lg"
          >
            {t('home.trustTitle')}
          </motion.h2>

          <div className="flex flex-col gap-6 w-full">
            {points.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-center gap-4 bg-surface p-4 rounded-2xl border border-outline-variant/50 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">{point.icon}</span>
                </div>
                <span className="text-[16px] font-medium text-on-surface">{point.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* VISUAL */}
        <div className="w-full md:w-1/2 h-[400px] flex items-center justify-center relative perspective-[1000px]">
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative w-full max-w-[300px] h-[300px] flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -200 + (i * 50),
                  x: (Math.random() - 0.5) * 100,
                  rotateZ: (Math.random() - 0.5) * 45,
                  opacity: 0
                }}
                whileInView={{ 
                  y: (i - 2) * 20,
                  x: 0,
                  rotateZ: 0,
                  opacity: 1
                }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2 + (i * 0.1), type: "spring", stiffness: 50 }}
                className="absolute w-full h-16 bg-surface border border-outline-variant/50 rounded-xl shadow-lg flex items-center px-6"
                style={{ translateZ: (5 - i) * 20 }}
              >
                <div className="w-8 h-2 bg-outline-variant/30 rounded-full" />
              </motion.div>
            ))}

            {/* Glowing organized beam connecting them */}
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="absolute w-1 h-[200px] bg-primary shadow-[0_0_20px_rgba(15,107,6,0.8)] z-50 left-[10%]"
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
}
