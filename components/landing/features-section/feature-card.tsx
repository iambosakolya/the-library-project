'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Star,
} from 'lucide-react';
import { featureCardStyles } from './styles';
import { features } from './constants';

/* ---------- feature card ---------- */
export function FeatureCard({
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
      className={featureCardStyles.card}
    >
      {/* gradient bg */}
      <div className={`${featureCardStyles.gradientBg} ${color}`} />

      <div className={featureCardStyles.content}>
        {/* icon with animation */}
        <div className={featureCardStyles.iconBox}>
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

        <h3 className={featureCardStyles.title}>{title}</h3>
        <p className={featureCardStyles.description}>{description}</p>
      </div>
    </motion.div>
  );
}
