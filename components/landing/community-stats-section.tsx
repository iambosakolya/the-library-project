'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, CalendarCheck, Globe } from 'lucide-react';
import { useIntersection } from './use-intersection';
import { useCountUp } from './use-count-up';

export type LandingStats = {
  totalClubs: number;
  totalEvents: number;
  totalMembers: number;
  totalBooksDiscussed: number;
};

function buildStats(data: LandingStats) {
  return [
    {
      label: 'Active Reading Clubs',
      value: data.totalClubs,
      suffix: data.totalClubs > 0 ? '+' : '',
      Icon: BookOpen,
      color: 'text-chart-1',
    },
    {
      label: 'Books Discussed',
      value: data.totalBooksDiscussed,
      suffix: data.totalBooksDiscussed > 0 ? '+' : '',
      Icon: Users,
      color: 'text-chart-2',
    },
    {
      label: 'Events Hosted',
      value: data.totalEvents,
      suffix: data.totalEvents > 0 ? '+' : '',
      Icon: CalendarCheck,
      color: 'text-chart-4',
    },
    {
      label: 'Community Members',
      value: data.totalMembers,
      suffix: data.totalMembers > 0 ? '+' : '',
      Icon: Globe,
      color: 'text-chart-3',
    },
  ];
}

type StatItem = ReturnType<typeof buildStats>[number];

function StatCard({
  label,
  value,
  suffix,
  Icon,
  color,
  started,
  index,
}: StatItem & { started: boolean; index: number }) {
  const count = useCountUp(value, 2200, started);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className='flex flex-col items-center rounded-2xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-lg'
    >
      <div className='mb-4 rounded-xl bg-secondary p-3'>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      <span className='text-4xl font-bold tabular-nums tracking-tight'>
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className='mt-1 text-sm text-muted-foreground'>{label}</span>
    </motion.div>
  );
}

export default function CommunityStatsSection({
  data,
}: {
  data?: LandingStats;
}) {
  const { ref, isVisible } = useIntersection();
  const stats = useMemo(
    () =>
      buildStats(
        data ?? {
          totalClubs: 0,
          totalEvents: 0,
          totalMembers: 0,
          totalBooksDiscussed: 0,
        },
      ),
    [data],
  );

  return (
    <section ref={ref} className='relative py-24 md:py-32'>
      {/* bg accent */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.03),transparent_70%)]' />

      <div className='relative px-6 md:px-12 xl:px-20 2xl:px-32'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='mb-16 text-center'
        >
          <span className='mb-3 inline-block rounded-full bg-secondary px-4 py-1 text-sm font-medium text-muted-foreground'>
            Growing every day
          </span>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>
            Our{' '}
            <span className='bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent'>
              Community
            </span>{' '}
            in Numbers
          </h2>
        </motion.div>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} started={isVisible} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
