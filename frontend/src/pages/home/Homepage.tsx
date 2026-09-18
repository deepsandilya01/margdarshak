import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useT as useTranslation } from '@/hooks/useTranslation';


import SectionWhatIs from '@/components/home/SectionWhatIs';
import SectionConceptCards from '@/components/home/SectionConceptCards';
import SectionHowItWorks from '@/components/home/SectionHowItWorks';
import SectionConversationalDemo from '@/components/home/SectionConversationalDemo';
import SectionMultilingual from '@/components/home/SectionMultilingual';
import SectionTrust from '@/components/home/SectionTrust';
import SectionFinalCTA from '@/components/home/SectionFinalCTA';

function Hero3D({ t }: { t: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for parallax
  const springConfig = { damping: 30, stiffness: 100, mass: 1 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // State for the animation sequence
  const [step, setStep] = useState(0); // 0: Idle, 1: Query, 2: Understanding, 3: Guidance

  useEffect(() => {
    // Loop the sequence every 4 seconds
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const labelMap = [
    "",
    t('home.hero3dUnderstanding'),
    t('home.hero3dGuiding'),
    t('home.hero3dAssisting')
  ];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[75vh] flex flex-col lg:flex-row items-center lg:items-start justify-between px-4 sm:px-6 lg:px-12 pt-12 lg:pt-24 pb-20 overflow-hidden bg-background"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 blur-[150px]" />
      </div>

      {/* LEFT: Typography */}
      <div className="relative z-10 flex flex-col items-start gap-6 w-full lg:w-5/12 max-w-2xl mt-8 lg:mt-0 text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant shadow-sm"
        >
          <img src="/logomain.png" alt="BIS Logo" className="w-5 h-5 object-contain" />
          <span className="text-[12px] font-bold uppercase tracking-widest text-primary">{t('home.badge')}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-[42px] md:text-[56px] lg:text-[64px] font-serif-hero text-on-surface tracking-tight leading-[1.15]"
        >
          {t('home.heroTitle')} <br />
          <span className="text-primary italic font-light">{t('home.heroSubtitle')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-[18px] md:text-[20px] text-on-surface-variant leading-relaxed"
        >
          {t('home.heroDesc')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
        >
          <Link
            to="/signup"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-on-primary text-[16px] font-semibold hover:bg-primary/90 transition-all shadow-md"
          >
            {t('home.getStarted')}
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl bg-surface-container-lowest text-primary text-[16px] font-semibold hover:bg-surface-container-low transition-all shadow-sm border border-outline-variant"
          >
            {t('home.seeHowItWorks')}
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-[13px] text-on-surface-variant/70 flex items-center gap-2 mt-2"
        >
          <span className="material-symbols-outlined text-[16px]">lock</span>
          {t('home.heroAuthHint')}
        </motion.p>
      </div>

      {/* RIGHT: 3D Visualization */}
      <div className="relative z-10 w-full lg:w-7/12 h-[500px] lg:h-[700px] mt-16 lg:mt-0 flex items-center justify-center perspective-[1200px]">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative w-full h-full flex items-center justify-center"
        >

          {/* Central AI SATHI Core */}
          <motion.div
            animate={{
              rotateZ: 360,
              scale: step === 2 ? 1.05 : 1
            }}
            transition={{
              rotateZ: { duration: 40, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, ease: "easeInOut" }
            }}
            className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-[2rem] border border-primary/30 flex items-center justify-center shadow-[0_0_50px_rgba(15,107,6,0.1)] backdrop-blur-sm bg-surface/30"
            style={{ transform: "translateZ(0px)" }}
          >
            <motion.div
              animate={{ rotateZ: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-3/4 h-3/4 rounded-full border border-secondary/40 border-dashed flex items-center justify-center"
            >
              <img src="/logomain.png" alt="Core" className="w-40 sm:w-48 h-auto object-contain opacity-90" />
            </motion.div>
          </motion.div>

          {/* Dynamic Label */}
          <AnimatePresence mode="wait">
            {step > 0 && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[20%] right-[30%] bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/50 text-[11px] font-bold tracking-widest text-primary shadow-lg"
                style={{ transform: "translateZ(60px)" }}
              >
                {labelMap[step]}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Object (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            animate={{
              opacity: step === 1 ? 1 : 0,
              x: step === 1 ? -120 : (step > 1 ? 0 : -200),
              scale: step > 1 ? 0 : 1
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute left-[5%] sm:left-[10%] p-4 rounded-2xl rounded-bl-sm bg-surface shadow-xl border border-outline-variant text-[12px] font-medium text-on-surface max-w-[180px]"
            style={{ transform: "translateZ(100px)" }}
          >
            {t('home.hero3dInput')}
          </motion.div>

          {/* Processing Nodes */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: step >= 2 ? 0.8 : 0,
                x: step >= 2 ? Math.cos(i * 72 * (Math.PI / 180)) * 140 : 0,
                y: step >= 2 ? Math.sin(i * 72 * (Math.PI / 180)) * 140 : 0,
              }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="absolute w-8 h-8 rounded-lg bg-surface-container border border-primary/20 shadow-md flex items-center justify-center"
              style={{ transform: `translateZ(${40 + i * 15}px)` }}
            >
              <span className="material-symbols-outlined text-[14px] text-primary/70">
                {['analytics', 'data_object', 'tune', 'insights', 'psychology'][i]}
              </span>
            </motion.div>
          ))}

          {/* Output Object (Right) */}
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{
              opacity: step === 3 ? 1 : 0,
              x: step === 3 ? 140 : 0
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute right-[5%] sm:right-[15%] p-5 rounded-2xl bg-surface-container-lowest shadow-2xl border border-primary/30 w-[200px] flex flex-col gap-3"
            style={{ transform: "translateZ(80px)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span className="text-[12px] font-bold text-on-surface uppercase tracking-wide">Guidance</span>
            </div>
            <div className="w-full h-2 rounded-full bg-outline-variant/30" />
            <div className="w-5/6 h-2 rounded-full bg-outline-variant/30" />
            <div className="w-full h-2 rounded-full bg-outline-variant/30 mt-2" />
            <div className="w-4/6 h-2 rounded-full bg-outline-variant/30" />
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

export default function Homepage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hero Parallax
  const { scrollYProgress: heroProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.3], [1, 0]);

  // Story / How it works scroll tracking
  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: storyProgress } = useScroll({ target: storyRef, offset: ["start end", "end start"] });
  const nodeScale = useTransform(storyProgress, [0.3, 0.5, 0.8], [0.8, 1, 0.8]);
  const nodeY = useTransform(storyProgress, [0.3, 0.8], [50, -50]);

  const { t } = useTranslation(['common']);

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)] overflow-x-hidden bg-background" ref={containerRef}>

      {/* ════════════════════════════════════════
          1. HERO SECTION (3D)
      ════════════════════════════════════════ */}
      <Hero3D t={t} />

      <SectionWhatIs t={t} />
      <SectionConceptCards />
      <SectionHowItWorks />
      <SectionConversationalDemo />
      <SectionMultilingual t={t} />
      <SectionTrust t={t} />
      <SectionFinalCTA t={t} />

    </div>
  );
}
