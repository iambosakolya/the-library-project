'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { testimonialsStyles } from './styles';
import { testimonials } from './constants';

export function TestimonialCard({ index }: { index: number }) {
  const t = testimonials[index];

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={t.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col items-center'
      >
        <p className={testimonialsStyles.quoteText}>&ldquo;{t.quote}&rdquo;</p>

        {/* avatar */}
        <div className={`${testimonialsStyles.avatarBase} ${t.color}`}>
          {t.avatar}
        </div>
        <span className={testimonialsStyles.name}>{t.name}</span>
        <span className={testimonialsStyles.club}>{t.club}</span>
      </motion.div>
    </AnimatePresence>
  );
}
