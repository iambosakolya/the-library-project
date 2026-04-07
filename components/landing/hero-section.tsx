'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Sparkles, ArrowRight } from 'lucide-react';

/* ---------- floating book element ---------- */
function FloatingBook({
  className,
  delay = 0,
  rotate = 0,
  size = 48,
}: {
  className?: string;
  delay?: number;
  rotate?: number;
  size?: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      initial={{ y: 0, rotate, opacity: 0.25 }}
      animate={{
        y: [0, -18, 0, 18, 0],
        rotate: [rotate, rotate + 4, rotate, rotate - 4, rotate],
        opacity: [0.18, 0.32, 0.18],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <BookOpen size={size} className='text-primary/20 dark:text-primary/15' />
    </motion.div>
  );
}

/* ---------- animated letter particles ---------- */
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
  '',
);

function FloatingLetters() {
  const [particles, setParticles] = useState<
    {
      id: number;
      char: string;
      x: number;
      y: number;
      size: number;
      dur: number;
    }[]
  >([]);

  useEffect(() => {
    const arr = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      char: LETTERS[Math.floor(Math.random() * LETTERS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 10 + Math.random() * 16,
      dur: 12 + Math.random() * 18,
    }));
    setParticles(arr);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className='pointer-events-none absolute select-none font-serif text-primary/[0.06] dark:text-primary/[0.08]'
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.04, 0.12, 0.04] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut' }}
        >
          {p.char}
        </motion.span>
      ))}
    </>
  );
}

/* ============================================================
   HERO SECTION
   ============================================================ */
export default function HeroSection() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 200]);
  const textY = useTransform(scrollY, [0, 600], [0, 80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className='relative min-h-[92vh] overflow-hidden bg-gradient-to-b from-secondary/60 via-background to-background dark:from-secondary/20'>
      {/* animated gradient blobs */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <motion.div
          className='absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl'
          animate={{ scale: [1, 1.15, 1], x: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className='absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-chart-2/10 blur-3xl'
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* floating letters */}
      <FloatingLetters />

      {/* floating books (parallax bg layer) */}
      <motion.div
        style={{ y: bgY }}
        className='pointer-events-none absolute inset-0'
      >
        <FloatingBook
          className='left-[8%] top-[12%]'
          delay={0}
          rotate={-12}
          size={54}
        />
        <FloatingBook
          className='right-[10%] top-[18%]'
          delay={1.5}
          rotate={10}
          size={42}
        />
        <FloatingBook
          className='bottom-[20%] left-[22%]'
          delay={3}
          rotate={-6}
          size={36}
        />
        <FloatingBook
          className='bottom-[15%] right-[25%]'
          delay={2}
          rotate={15}
          size={50}
        />
        <FloatingBook
          className='left-[50%] top-[8%]'
          delay={4}
          rotate={-18}
          size={30}
        />
        <FloatingBook
          className='bottom-[30%] right-[42%]'
          delay={2.5}
          rotate={8}
          size={40}
        />
      </motion.div>

      {/* content */}
      <motion.div
        style={{ y: textY, opacity }}
        className='relative z-10 mx-auto flex w-full flex-col items-center justify-center px-6 pt-36 text-center md:px-12 md:pt-44 lg:pt-52 xl:px-20 2xl:px-32'
      >
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-sm backdrop-blur'
        >
          <Sparkles className='h-4 w-4 text-chart-4' />
          <span className='text-muted-foreground'>
            A community for book&nbsp;lovers
          </span>
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className='text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'
        >
          Where Book Lovers{' '}
          <span className='bg-gradient-to-r from-chart-1 via-chart-4 to-chart-2 bg-clip-text text-transparent'>
            Unite
          </span>
        </motion.h1>

        {/* sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className='mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl'
        >
          Join reading clubs, attend literary events, and share your passion for
          books with a vibrant community of readers everywhere.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className='mt-10 flex flex-col gap-4 sm:flex-row'
        >
          <Button
            size='lg'
            asChild
            className='group gap-2 text-base shadow-lg shadow-primary/20'
          >
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
            className='gap-2 text-base'
          >
            <Link href='/events'>
              <BookOpen className='h-5 w-5' />
              Explore Events
            </Link>
          </Button>
        </motion.div>

        {/* hero visual: illustration of people reading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className='mt-16 w-full max-w-5xl'
        >
          <div className='relative mx-auto aspect-[16/8] w-full overflow-hidden rounded-2xl border bg-gradient-to-br from-secondary/40 to-background shadow-2xl'>
            {/* illustration composition */}
            <div className='absolute inset-0 flex items-end justify-center gap-6 p-8'>
              {/* person 1 – seated reader */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className='flex flex-col items-center'
              >
                <div className='h-10 w-10 rounded-full bg-chart-1/70 sm:h-14 sm:w-14' />
                <div className='mt-1 h-14 w-12 rounded-lg bg-chart-1/30 sm:h-20 sm:w-16' />
                <div className='-mt-2 h-5 w-8 rotate-12 rounded bg-primary/20 sm:h-7 sm:w-10' />
              </motion.div>

              {/* bookshelf */}
              <div className='hidden flex-col items-center gap-1 md:flex'>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className='h-16 rounded bg-chart-3/30'
                    style={{ width: 12 + i * 4 }}
                    animate={{ height: [64, 58, 64] }}
                    transition={{
                      duration: 3,
                      delay: i * 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>

              {/* person 2 – standing reader */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className='flex flex-col items-center'
              >
                <div className='h-10 w-10 rounded-full bg-chart-4/70 sm:h-14 sm:w-14' />
                <div className='h-18 mt-1 w-10 rounded-lg bg-chart-4/30 sm:h-24 sm:w-14' />
                <div className='-mt-3 h-5 w-7 -rotate-6 rounded bg-primary/20 sm:h-7 sm:w-9' />
              </motion.div>

              {/* laptop / online reader */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                className='flex flex-col items-center'
              >
                <div className='h-10 w-10 rounded-full bg-chart-2/70 sm:h-14 sm:w-14' />
                <div className='mt-1 h-12 w-12 rounded-lg bg-chart-2/30 sm:h-16 sm:w-16' />
                <div className='-mt-1 h-3 w-16 rounded bg-muted sm:w-20' />
              </motion.div>

              {/* person 3 – bean-bag reader */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1.8,
                }}
                className='hidden flex-col items-center sm:flex'
              >
                <div className='h-10 w-10 rounded-full bg-chart-5/70 sm:h-14 sm:w-14' />
                <div className='mt-1 h-10 w-14 rounded-full bg-chart-5/30 sm:h-14 sm:w-20' />
                <div className='-mt-2 h-5 w-7 rotate-6 rounded bg-primary/20 sm:h-7 sm:w-9' />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
