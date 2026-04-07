'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    club: 'Classic Lit Enthusiasts',
    avatar: 'SM',
    color: 'bg-chart-1/20 text-chart-1',
    quote:
      'Joining this platform changed how I read. The discussions in my club have given me so many new perspectives on the books I love.',
  },
  {
    id: 2,
    name: 'David Chen',
    club: 'Sci-Fi Explorers',
    avatar: 'DC',
    color: 'bg-chart-2/20 text-chart-2',
    quote:
      'The events are incredible — I met one of my favorite authors at a launch hosted through this platform. The community is warm and welcoming.',
  },
  {
    id: 3,
    name: 'Amara Johnson',
    club: 'Poetry Circle',
    avatar: 'AJ',
    color: 'bg-chart-4/20 text-chart-4',
    quote:
      'The reading analytics motivate me to read more and diversify my genres. I&apos;ve discovered so many hidden gems through personalized picks.',
  },
  {
    id: 4,
    name: 'Liam OBrien',
    club: 'Thriller Addicts',
    avatar: 'LO',
    color: 'bg-chart-3/20 text-chart-3',
    quote:
      'We went from reading alone to building real friendships around books. This is the social network readers have been waiting for.',
  },
];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const t = testimonials[index];

  return (
    <section className='relative py-24 md:py-32'>
      <div className='px-6 text-center md:px-12 xl:px-20 2xl:px-32'>
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='mb-14'
        >
          <span className='mb-3 inline-block rounded-full bg-secondary px-4 py-1 text-sm font-medium text-muted-foreground'>
            Words from our readers
          </span>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>
            What Our{' '}
            <span className='bg-gradient-to-r from-chart-1 to-chart-4 bg-clip-text text-transparent'>
              Community
            </span>{' '}
            Says
          </h2>
        </motion.div>

        {/* quote card */}
        <div className='relative mx-auto max-w-2xl'>
          <Quote className='mx-auto mb-6 h-10 w-10 text-muted-foreground/20' />

          <AnimatePresence mode='wait'>
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className='flex flex-col items-center'
            >
              <p className='mb-8 text-lg italic leading-relaxed text-muted-foreground sm:text-xl'>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* avatar */}
              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${t.color}`}
              >
                {t.avatar}
              </div>
              <span className='font-bold'>{t.name}</span>
              <span className='text-sm text-muted-foreground'>{t.club}</span>
            </motion.div>
          </AnimatePresence>

          {/* dot indicators */}
          <div className='mt-8 flex justify-center gap-2'>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30'
                }`}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
