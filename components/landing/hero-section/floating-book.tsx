'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { ANIMATION_DURATIONS } from './constants';
import { floatingBookStyles } from './styles';

interface FloatingBookProps {
  className?: string;
  delay?: number;
  rotate?: number;
  size?: number;
}

export function FloatingBook({
  className,
  delay = 0,
  rotate = 0,
  size = 48,
}: FloatingBookProps) {
  return (
    <motion.div
      className={`${floatingBookStyles.wrapper} ${className}`}
      initial={{ y: 0, rotate, opacity: 0.25 }}
      animate={{
        y: [0, -18, 0, 18, 0],
        rotate: [rotate, rotate + 4, rotate, rotate - 4, rotate],
        opacity: [0.18, 0.32, 0.18],
      }}
      transition={{
        duration: ANIMATION_DURATIONS.floatingBook,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <BookOpen size={size} className={floatingBookStyles.icon} />
    </motion.div>
  );
}
