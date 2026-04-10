'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';

export default function CTASection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 4000);
  };

  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary py-24 md:py-32'>
      {/* decorative blobs */}
      <div className='pointer-events-none absolute inset-0'>
        <motion.div
          className='absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl'
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className='absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/5 blur-3xl'
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* floating icons */}
        <motion.div
          className='absolute left-[10%] top-[20%]'
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BookOpen className='h-8 w-8 text-primary-foreground/10' />
        </motion.div>
        <motion.div
          className='absolute bottom-[25%] right-[15%]'
          animate={{ y: [0, -12, 0], rotate: [0, -6, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        >
          <Sparkles className='h-6 w-6 text-primary-foreground/10' />
        </motion.div>
      </div>

      <div className='relative z-10 mx-auto w-full px-6 text-center md:px-12 xl:px-20 2xl:px-32'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl'>
            Ready to Join Our
            <br />
            Reading Community?
          </h2>
          <p className='mx-auto mt-5 max-w-xl text-lg text-primary-foreground/70'>
            Sign up today and connect with thousands of book lovers around the
            world. Your next favorite book is just a conversation away.
          </p>

          {/* email form */}
          <form
            onSubmit={handleSubmit}
            className='mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row'
          >
            <Input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='h-12 flex-1 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/40'
            />
            <Button
              type='submit'
              size='lg'
              disabled={submitted}
              className='group gap-2 bg-primary-foreground text-primary shadow-lg hover:bg-primary-foreground/90'
            >
              {submitted ? (
                <>
                  <CheckCircle2 className='h-5 w-5' />
                  Subscribed!
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                </>
              )}
            </Button>
          </form>

          {/* social proof */}
          <p className='mt-6 text-sm text-primary-foreground/50'>
            Join{' '}
            <span className='font-semibold text-primary-foreground/70'>
              10,000+
            </span>{' '}
            book lovers already on the platform
          </p>
        </motion.div>
      </div>
    </section>
  );
}
