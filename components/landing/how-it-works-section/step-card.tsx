'use client';

import { motion } from 'framer-motion';
import { howItWorksStyles, stepBadgeClass } from './styles';

import type { steps as StepsConst } from './constants';

type Step = (typeof StepsConst)[number];

export function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <motion.div
      key={step.num}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={howItWorksStyles.stepCard}
    >
      {/* numbered badge */}
      <div className={stepBadgeClass(step.accent)}>
        <span className='text-2xl font-bold opacity-60'>0{step.num}</span>
        <step.Icon className='mt-1 h-8 w-8' />
      </div>

      <h3 className={howItWorksStyles.stepTitle}>{step.title}</h3>
      <p className={howItWorksStyles.stepDescription}>{step.description}</p>
    </motion.div>
  );
}
