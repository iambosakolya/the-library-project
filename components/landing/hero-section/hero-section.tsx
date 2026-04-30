'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, ArrowRight } from 'lucide-react';
import { TegakiRenderer } from 'tegaki';
import bundle from 'tegaki/fonts/caveat';

import { FloatingBook } from './floating-book';
import { FloatingLetters } from './floating-letters';
import {
  FLOATING_BOOKS_CONFIG,
  SCROLL_RANGES,
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
} from './constants';
import { sectionStyles, floatingBookStyles, tegakiStyles } from './styles';

import { contentStyles } from '../shared/styles';

export default function HeroSection() {
  const { scrollY } = useScroll();
  const bgY = useTransform(
    scrollY,
    SCROLL_RANGES.bgY.input,
    SCROLL_RANGES.bgY.output,
  );
  const textY = useTransform(
    scrollY,
    SCROLL_RANGES.textY.input,
    SCROLL_RANGES.textY.output,
  );
  const opacity = useTransform(
    scrollY,
    SCROLL_RANGES.opacity.input,
    SCROLL_RANGES.opacity.output,
  );

  return (
    <section className={sectionStyles.wrapper}>
      {/* animated gradient blobs */}
      <div className={sectionStyles.blobContainer}>
        <motion.div
          className={sectionStyles.blobPrimary}
          animate={{ scale: [1, 1.15, 1], x: [0, 40, 0] }}
          transition={{
            duration: ANIMATION_DURATIONS.blobPrimary,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className={sectionStyles.blobSecondary}
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
          transition={{
            duration: ANIMATION_DURATIONS.blobSecondary,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* floating letters */}
      <FloatingLetters />

      {/* floating books (parallax bg layer) */}
      <motion.div
        style={{ y: bgY }}
        className={floatingBookStyles.parallaxLayer}
      >
        {FLOATING_BOOKS_CONFIG.map((book, i) => (
          <FloatingBook
            key={i}
            className={book.className}
            delay={book.delay}
            rotate={book.rotate}
            size={book.size}
          />
        ))}
      </motion.div>

      {/* content */}
      <motion.div
        style={{ y: textY, opacity }}
        className={contentStyles.container}
      >
        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: ANIMATION_DURATIONS.headline,
            delay: ANIMATION_DELAYS.headline,
          }}
          className={contentStyles.headline}
        >
          <TegakiRenderer
            font={bundle}
            time={{ mode: 'uncontrolled', speed: 0.8, loop: false }}
            style={tegakiStyles}
          >
            Where Book Lovers
          </TegakiRenderer>
          <span className={contentStyles.gradientText}>Unite</span>
        </motion.h1>

        {/* sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: ANIMATION_DURATIONS.subHeadline,
            delay: ANIMATION_DELAYS.subHeadline,
          }}
          className={contentStyles.subHeadline}
        >
          Join reading clubs, attend literary events, and share your passion for
          books with a vibrant community of readers everywhere.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: ANIMATION_DURATIONS.cta,
            delay: ANIMATION_DELAYS.cta,
          }}
          className={contentStyles.ctaContainer}
        >
          <Button size='lg' asChild className={contentStyles.primaryButton}>
            <Link href='/sign-up'>
              <Users className='h-5 w-5' />
              Start Reading Together
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>
          </Button>
          <Button
            size='lg'
            variant='outline'
            asChild
            className={contentStyles.secondaryButton}
          >
            <Link href='/events'>
              <BookOpen className='h-5 w-5' />
              Explore Events
            </Link>
          </Button>
        </motion.div>

        {/* hero visual placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: ANIMATION_DURATIONS.heroVisual,
            delay: ANIMATION_DELAYS.heroVisual,
          }}
          className={contentStyles.heroVisualWrapper}
        />
      </motion.div>
    </section>
  );
}
