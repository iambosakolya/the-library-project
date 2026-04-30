'use client';

import { motion } from 'framer-motion';

import { contentStyles } from '../shared/styles';
import { steps } from './constants';
import { howItWorksStyles } from './styles';
import { StepCard } from './step-card';

export default function HowItWorksSection() {
  return (
    <section className={howItWorksStyles.section}>
      {/* subtle bg pattern */}
      <div className={howItWorksStyles.bgPattern} />

      <div className={howItWorksStyles.container}>
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={howItWorksStyles.headingWrapper}
        >
          <span className={howItWorksStyles.badge}>Simple & intuitive</span>
          <h2 className={howItWorksStyles.title}>
            How It <span className={contentStyles.gradientText}>Works</span>
          </h2>
        </motion.div>

        {/* steps */}
        <div className={howItWorksStyles.grid}>
          {/* timeline connector bar (desktop) */}
          <motion.div
            className={howItWorksStyles.timelineBar}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ originX: 0 }}
          >
            <div className={howItWorksStyles.timelineGradient} />
          </motion.div>

          {steps.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
