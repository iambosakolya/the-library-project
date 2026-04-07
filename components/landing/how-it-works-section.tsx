'use client';

import { motion } from 'framer-motion';
import { UserPlus, Search, MessageCircle, TrendingUp } from 'lucide-react';

const steps = [
  {
    num: 1,
    title: 'Create your reader profile',
    description:
      'Sign up and tell us about your reading preferences and favorite genres.',
    Icon: UserPlus,
    accent: 'bg-chart-1/15 text-chart-1 border-chart-1/30',
  },
  {
    num: 2,
    title: 'Browse clubs & events',
    description:
      'Discover reading clubs and literary events that match your interests.',
    Icon: Search,
    accent: 'bg-chart-2/15 text-chart-2 border-chart-2/30',
  },
  {
    num: 3,
    title: 'Participate & discuss',
    description:
      'Join discussions, attend events, and share your thoughts with fellow readers.',
    Icon: MessageCircle,
    accent: 'bg-chart-4/15 text-chart-4 border-chart-4/30',
  },
  {
    num: 4,
    title: 'Track & discover',
    description:
      'Track your reading progress, earn badges, and get personalized recommendations.',
    Icon: TrendingUp,
    accent: 'bg-chart-3/15 text-chart-3 border-chart-3/30',
  },
];

export default function HowItWorksSection() {
  return (
    <section className='relative overflow-hidden bg-secondary/30 py-24 dark:bg-secondary/10 md:py-32'>
      {/* subtle bg pattern */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.03),transparent_50%)]' />

      <div className='relative px-6 md:px-12 xl:px-20 2xl:px-32'>
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='mb-16 text-center'
        >
          <span className='mb-3 inline-block rounded-full bg-background px-4 py-1 text-sm font-medium text-muted-foreground shadow-sm'>
            Simple & intuitive
          </span>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>
            How It{' '}
            <span className='bg-gradient-to-r from-chart-4 to-chart-1 bg-clip-text text-transparent'>
              Works
            </span>
          </h2>
        </motion.div>

        {/* steps */}
        <div className='relative grid gap-8 md:grid-cols-4'>
          {/* timeline connector bar (desktop) */}
          <motion.div
            className='absolute left-0 right-0 top-[60px] z-0 hidden h-0.5 md:block'
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ originX: 0 }}
          >
            <div className='h-full w-full bg-gradient-to-r from-chart-1/40 via-chart-4/40 to-chart-3/40' />
          </motion.div>

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className='relative z-10 flex flex-col items-center text-center'
            >
              {/* numbered badge */}
              <div
                className={`mb-5 flex h-[120px] w-[120px] flex-col items-center justify-center rounded-2xl border ${step.accent} shadow-sm transition-transform duration-300 hover:scale-105`}
              >
                <span className='text-2xl font-bold opacity-60'>
                  0{step.num}
                </span>
                <step.Icon className='mt-1 h-8 w-8' />
              </div>

              <h3 className='mb-2 text-lg font-bold'>{step.title}</h3>
              <p className='max-w-[220px] text-sm leading-relaxed text-muted-foreground'>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
