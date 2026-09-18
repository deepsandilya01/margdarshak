import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SectionFinalCTA({ t }: { t: any }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative w-full py-16 lg:py-24 bg-surface overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative max-w-[1000px] mx-auto p-12 md:p-20 rounded-[3rem] bg-surface-container-low border border-outline-variant/30 shadow-2xl flex flex-col items-center text-center overflow-hidden">

          {/* Ambient Glow */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <motion.div
              animate={{
                scale: isHovered ? 1.2 : 1,
                opacity: isHovered ? 0.6 : 0.3
              }}
              transition={{ duration: 0.8 }}
              className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-[80px]"
            />
          </div>

          {/* 3D Core Mini (Echoes Hero) */}
          <div className="relative z-10 w-32 h-32 mb-10 perspective-[1000px]">
            <motion.div
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateZ: 360, rotateY: isHovered ? 20 : 0, rotateX: isHovered ? -20 : 0 }}
              transition={{
                rotateZ: { duration: 30, repeat: Infinity, ease: "linear" },
                rotateY: { duration: 0.8, ease: "easeOut" },
                rotateX: { duration: 0.8, ease: "easeOut" }
              }}
              className="w-full h-full rounded-full border border-primary/20 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotateZ: -360, scale: isHovered ? 1.1 : 1 }}
                transition={{
                  rotateZ: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 0.5 }
                }}
                className="w-3/4 h-3/4 rounded-full border border-secondary/40 border-dashed flex items-center justify-center"
              >
                <img src="/logomain.png" alt="BIS Logo" className="w-20 sm:w-24 h-auto object-contain opacity-90" />
              </motion.div>
            </motion.div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[36px] md:text-[48px] leading-tight md:leading-[1.15] font-serif-hero text-on-surface mb-6 relative z-10"
          >
            {t('home.ctaTitle')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[18px] text-on-surface-variant max-w-2xl mb-12 relative z-10"
          >
            {t('home.ctaSub')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto"
          >
            <Link
              to="/signup"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="px-8 py-4 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg text-center flex items-center justify-center gap-2 group"
            >
              {t('home.ctaPrimary')}
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>

            <Link
              to="/login"
              className="px-8 py-4 bg-surface-container text-on-surface rounded-full font-medium hover:bg-surface-container-high border border-outline-variant/30 transition-colors text-center"
            >
              {t('home.ctaSecondary')}
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
