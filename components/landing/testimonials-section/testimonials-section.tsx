'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

import { testimonials, AUTO_ROTATE_INTERVAL } from './constants';
import { testimonialsStyles } from './styles';
import { TestimonialCard } from './testimonial-card';

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, AUTO_ROTATE_INTERVAL);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className={testimonialsStyles.section}>
      <div className={testimonialsStyles.container}>
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={testimonialsStyles.headingWrapper}
        >
          <span className={testimonialsStyles.badge}>
            Words from our readers
          </span>
          <h2 className={testimonialsStyles.title}>
            What Our{' '}
            <span>Community</span>{' '}
            Says
          </h2>
        </motion.div>

        {/* quote card */}
        <div className={testimonialsStyles.quoteWrapper}>
          <Quote className={testimonialsStyles.quoteIcon} />

          <TestimonialCard index={index} />

          {/* dot indicators */}
          <div className={testimonialsStyles.dotsWrapper}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={
                  i === index
                    ? testimonialsStyles.dotActive
                    : testimonialsStyles.dotInactive
                }
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
