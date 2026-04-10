'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Star,
  Users,
} from 'lucide-react';
import { useIntersection } from './use-intersection';

/* ---------- feature data ---------- */
const features = [
  {
    title: 'Reading Clubs',
    description:
      'Create or join reading clubs. Discuss your favorite books with like-minded readers.',
    Icon: Users,
    color: 'from-chart-1/20 to-chart-1/5',
    iconColor: 'text-chart-1',
    animation: 'pages' as const,
  },
  {
    title: 'Literary Events',
    description:
      'Attend author meetups, book launches, and reading sessions online or in-person.',
    Icon: CalendarDays,
    color: 'from-chart-2/20 to-chart-2/5',
    iconColor: 'text-chart-2',
    animation: 'calendar' as const,
  },
  {
    title: 'Book Reviews & Discussions',
    description:
      'Share reviews, rate books, and engage in meaningful literary discussions.',
    Icon: MessageSquare,
    color: 'from-chart-4/20 to-chart-4/5',
    iconColor: 'text-chart-4',
    animation: 'stars' as const,
  },
  {
    title: 'Personal Reading Analytics',
    description:
      'Track your reading journey with insights and personalized recommendations.',
    Icon: BarChart3,
    color: 'from-chart-3/20 to-chart-3/5',
    iconColor: 'text-chart-3',
    animation: 'chart' as const,
  },
];

/* ---------- feature card ---------- */
function FeatureCard({
  title,
  description,
  color,
  iconColor,
  animation,
  index,
}: (typeof features)[number] & { index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className='group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl'
    >
      {/* gradient bg */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className='relative z-10'>
        {/* icon with animation */}
        <div className='mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary transition-colors duration-300 group-hover:bg-background'>
          {animation === 'pages' && (
            <div className='relative'>
              <BookOpen className={`h-7 w-7 ${iconColor}`} />
              {hovered && (
                <>
                  <motion.div
                    className='absolute -right-1 -top-1 h-3 w-2 rounded-sm bg-chart-1/40'
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: [0, 180, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className='absolute -left-1 -top-1 h-3 w-2 rounded-sm bg-chart-1/30'
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: [0, -180, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                  />
                </>
              )}
            </div>
          )}
          {animation === 'calendar' && (
            <div className='relative'>
              <CalendarDays className={`h-7 w-7 ${iconColor}`} />
              {hovered && (
                <motion.div
                  className='absolute bottom-0 right-0 flex gap-[1px]'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[1, 2, 3].map((n) => (
                    <motion.span
                      key={n}
                      className='block h-[5px] w-[5px] rounded-[1px] bg-chart-2/60'
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 0.8,
                        delay: n * 0.25,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          )}
          {animation === 'stars' && (
            <div className='relative'>
              <MessageSquare className={`h-7 w-7 ${iconColor}`} />
              {hovered && (
                <div className='absolute -right-2 -top-2 flex gap-[2px]'>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.2, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.12 }}
                    >
                      <Star className='h-2.5 w-2.5 fill-chart-4 text-chart-4' />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
          {animation === 'chart' && (
            <div className='relative'>
              <BarChart3 className={`h-7 w-7 ${iconColor}`} />
              {hovered && (
                <div className='absolute -bottom-1 right-0 flex items-end gap-[2px]'>
                  {[8, 14, 10, 18].map((h, i) => (
                    <motion.div
                      key={i}
                      className='w-[4px] rounded-sm bg-chart-3/60'
                      initial={{ height: 2 }}
                      animate={{ height: h }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <h3 className='mb-2 text-xl font-bold'>{title}</h3>
        <p className='leading-relaxed text-muted-foreground'>{description}</p>
      </div>
    </motion.div>
  );
}

/* ============================================================
   FEATURES SECTION
   ============================================================ */
export default function FeaturesSection() {
  const { ref } = useIntersection();

  return (
    <section ref={ref} className='relative py-24 md:py-32'>
      <div className='px-6 md:px-12 xl:px-20 2xl:px-32'>
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='mb-16 text-center'
        >
          <span className='mb-3 inline-block rounded-full bg-secondary px-4 py-1 text-sm font-medium text-muted-foreground'>
            Everything you need
          </span>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>
            Built for Readers,{' '}
            <span className='bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent'>
              by Readers
            </span>
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-lg text-muted-foreground'>
            Everything you need to connect, share, and grow as a reader — all in
            one place.
          </p>
        </motion.div>

        {/* cards grid */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
