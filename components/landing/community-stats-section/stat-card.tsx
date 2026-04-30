'use client';

import { motion } from 'framer-motion';
import { useCountUp } from '../use-count-up';
import { statCardStyles } from './styles';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  suffix: string;
  Icon: LucideIcon;
  color: string;
  started: boolean;
  index: number;
}

export function StatCard({
  label,
  value,
  suffix,
  Icon,
  color,
  started,
  index,
}: StatCardProps) {
  const count = useCountUp(value, 2200, started);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={statCardStyles.card}
    >
      <div className={statCardStyles.iconWrapper}>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      <span className={statCardStyles.value}>
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className={statCardStyles.label}>{label}</span>
    </motion.div>
  );
}
