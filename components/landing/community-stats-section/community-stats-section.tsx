'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useIntersection } from '../use-intersection';
import { buildStats, DEFAULT_STATS } from './constants';
import { communityStatsStyles } from './styles';
import { StatCard } from './stat-card';

export type LandingStats = {
  totalClubs: number;
  totalEvents: number;
  totalMembers: number;
  totalBooksDiscussed: number;
};

export default function CommunityStatsSection({
  data,
}: {
  data?: LandingStats;
}) {
  const { ref, isVisible } = useIntersection();
  const stats = useMemo(() => buildStats(data ?? DEFAULT_STATS), [data]);

  return (
    <section ref={ref} className={communityStatsStyles.section}>
      {/* bg accent */}
      <div className={communityStatsStyles.bgAccent} />

      <div className={communityStatsStyles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={communityStatsStyles.headingWrapper}
        >
          <span className={communityStatsStyles.badge}>Growing every day</span>
          <h2 className={communityStatsStyles.title}>
            Our{' '}
            <span className={communityStatsStyles.gradientText}>Community</span>{' '}
            in Numbers
          </h2>
        </motion.div>

        <div className={communityStatsStyles.grid}>
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} started={isVisible} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
