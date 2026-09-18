import React from 'react';
import { motion } from 'framer-motion';

export default function SectionConceptCards() {
  const concepts = [
    {
      title: "Understand",
      desc: "AI SATHI understands what you are actually asking, parsing natural language to identify relevant standards and regulations.",
      icon: "psychology",
      color: "text-primary"
    },
    {
      title: "Guide",
      desc: "Move through your compliance requirements step-by-step with intelligent, contextual guidance tailored to your specific product.",
      icon: "route",
      color: "text-secondary"
    },
    {
      title: "Explain",
      desc: "Complex regulatory information and technical specifications are presented in a clearer, easy-to-digest format.",
      icon: "lightbulb",
      color: "text-tertiary"
    },
    {
      title: "Converse",
      desc: "Describe your requirement naturally. No need to memorize exact IS numbers or rigid search syntax.",
      icon: "forum",
      color: "text-primary"
    }
  ];

  return (
    <section className="relative w-full py-16 lg:py-24 bg-background overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-[32px] md:text-[40px] leading-tight md:leading-[1.15] font-serif-hero text-on-surface mb-4"
          >
            A New Way to Interact with Standards
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="text-[18px] text-on-surface-variant max-w-2xl mx-auto"
          >
            Experience a professional AI workspace designed for government-grade clarity and absolute reliability.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {concepts.map((concept, i) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glossy-card h-full p-8 flex flex-col items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant/50 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <span className={`material-symbols-outlined text-[24px] ${concept.color}`}>
                  {concept.icon}
                </span>
              </div>
              <h3 className="text-[20px] font-semibold text-on-surface tracking-tight">
                {concept.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-on-surface-variant">
                {concept.desc}
              </p>
              
              <div className="gloss-sheen"></div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
