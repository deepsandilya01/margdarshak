import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function SectionHowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Tell",
      desc: "Describe your problem in your own words.",
      icon: "chat"
    },
    {
      num: "02",
      title: "Understand",
      desc: "AI SATHI identifies the context and regulations.",
      icon: "psychology"
    },
    {
      num: "03",
      title: "Clarify",
      desc: "AI SATHI asks for additional information when needed.",
      icon: "help_outline"
    },
    {
      num: "04",
      title: "Guide",
      desc: "AI SATHI helps you understand what comes next.",
      icon: "directions"
    }
  ];

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate the active step based on scroll
  const activeStep = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 2, 3, 3]);

  return (
    <section id="how-it-works" className="relative w-full py-16 lg:py-24 bg-surface-container-lowest overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-[32px] md:text-[40px] leading-tight md:leading-[1.15] font-serif-hero text-on-surface mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="text-[18px] text-on-surface-variant max-w-2xl mx-auto"
          >
            A seamless, connected experience to guide you through compliance.
          </motion.p>
        </div>

        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-outline-variant/30 hidden lg:block transform -translate-y-1/2 rounded-full overflow-hidden z-0">
            <motion.div 
              className="h-full bg-primary"
              style={{ scaleX: smoothProgress, transformOrigin: "left" }}
            />
          </div>
          <div className="absolute left-6 top-0 w-[2px] h-full bg-outline-variant/30 lg:hidden rounded-full overflow-hidden z-0">
            <motion.div 
              className="w-full bg-primary origin-top"
              style={{ scaleY: smoothProgress, transformOrigin: "top" }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} activeStep={activeStep} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function StepCard({ step, index, activeStep }: { step: any, index: number, activeStep: any }) {
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    return activeStep.on("change", (v: number) => {
      setIsActive(Math.round(v) === index);
    });
  }, [activeStep, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative p-6 lg:p-8 rounded-2xl flex flex-col h-full lg:items-center lg:text-center transition-all duration-300 ml-12 lg:ml-0 ${
        isActive 
          ? 'bg-surface shadow-xl border border-primary/20 scale-[1.03] z-10' 
          : 'bg-surface-container-low/50 border border-transparent hover:bg-surface-container hover:border-outline-variant/30 opacity-70 hover:opacity-100'
      }`}
    >
      <div className={`absolute -left-12 lg:left-1/2 lg:-top-6 lg:-ml-6 w-12 h-12 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-serif-hero text-[18px] font-bold transition-colors duration-300 ${
        isActive ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-variant text-on-surface-variant'
      }`}>
        {step.num}
      </div>
      
      <span className={`material-symbols-outlined text-[32px] mb-4 transition-colors duration-300 hidden lg:block mt-4 ${
        isActive ? 'text-primary' : 'text-on-surface-variant'
      }`}>
        {step.icon}
      </span>

      <h3 className={`text-[20px] font-semibold mb-2 transition-colors duration-300 ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
        {step.title}
      </h3>
      <p className="text-[14px] leading-relaxed text-on-surface-variant">
        {step.desc}
      </p>
    </motion.div>
  );
}
