import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function SectionConversationalDemo() {
  return (
    <section className="relative w-full py-16 lg:py-24 bg-surface overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 max-w-[1000px] mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-[32px] md:text-[40px] leading-tight md:leading-[1.15] font-serif-hero text-on-surface mb-4"
          >
            Conversational Intelligence
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="text-[18px] text-on-surface-variant max-w-2xl mx-auto"
          >
            Interact naturally. AI SATHI dynamically clarifies your needs before providing authoritative guidance.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[1000px] glossy-card p-6 md:p-10 mx-auto flex flex-col gap-6 relative"
        >
          {/* User Message */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="self-end flex items-start gap-3 max-w-[80%]"
          >
            <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl rounded-tr-sm px-5 py-3 text-[15px] text-on-surface shadow-sm">
              I need help understanding my compliance requirement.
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[12px] shrink-0">
              U
            </div>
          </motion.div>

          {/* AI Response 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
            className="self-start flex items-start gap-3 max-w-[80%]"
          >
            <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant/50 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="AI SATHI" className="w-5 h-5 object-contain opacity-80" />
            </div>
            <div className="bg-surface rounded-2xl rounded-tl-sm px-5 py-3 text-[15px] text-on-surface shadow-sm border border-outline-variant/30 flex flex-col gap-2">
              <p>I can certainly help you with that. Let's understand your requirement first.</p>
            </div>
          </motion.div>

          {/* AI Response 2 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 2.1 }}
            className="self-start flex items-start gap-3 max-w-[80%] ml-11"
          >
            <div className="bg-surface rounded-2xl rounded-tl-sm px-5 py-3 text-[15px] text-on-surface shadow-md border border-primary/20 flex flex-col gap-3 w-full">
              <p className="font-medium">What type of product or requirement are you working with?</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <button className="px-3 py-1.5 rounded-lg border border-outline-variant/50 text-[13px] text-on-surface-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                  Electronics
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-outline-variant/50 text-[13px] text-on-surface-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                  Chemicals
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-outline-variant/50 text-[13px] text-on-surface-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                  Textiles
                </button>
              </div>
            </div>
          </motion.div>

          <div className="gloss-sheen"></div>
        </motion.div>

      </div>
    </section>
  );
}
