'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';

import { ctaStyles } from './styles';
import {
  CTA_RESET_DELAY,
  BLOB_ANIMATIONS,
  FLOATING_ICON_ANIMATIONS,
} from './constants';

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
    }, CTA_RESET_DELAY);
  };

  return (
    <section className={ctaStyles.section}>
      {/* decorative blobs */}
      <div className={ctaStyles.blobContainer}>
        <motion.div
          className={ctaStyles.blobLeft}
          animate={BLOB_ANIMATIONS.left.animate}
          transition={BLOB_ANIMATIONS.left.transition}
        />
        <motion.div
          className={ctaStyles.blobRight}
          animate={BLOB_ANIMATIONS.right.animate}
          transition={BLOB_ANIMATIONS.right.transition}
        />
        {/* floating icons */}
        <motion.div
          className={ctaStyles.floatingIconLeft}
          animate={FLOATING_ICON_ANIMATIONS.left.animate}
          transition={FLOATING_ICON_ANIMATIONS.left.transition}
        >
          <BookOpen className={ctaStyles.floatingIconStyle} />
        </motion.div>
        <motion.div
          className={ctaStyles.floatingIconRight}
          animate={FLOATING_ICON_ANIMATIONS.right.animate}
          transition={FLOATING_ICON_ANIMATIONS.right.transition}
        >
          <Sparkles className={ctaStyles.floatingIconSmallStyle} />
        </motion.div>
      </div>

      <div className={ctaStyles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={ctaStyles.title}>
            Ready to Join Our
            <br />
            Reading Community?
          </h2>
          <p className={ctaStyles.subtitle}>
            Sign up today and connect with thousands of book lovers around the
            world. Your next favorite book is just a conversation away.
          </p>

          {/* email form */}
          <form onSubmit={handleSubmit} className={ctaStyles.form}>
            <Input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={ctaStyles.input}
            />
            <Button
              type='submit'
              size='lg'
              disabled={submitted}
              className={ctaStyles.submitButton}
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
          <p className={ctaStyles.socialProof}>
            Join <span className={ctaStyles.socialProofHighlight}>10,000+</span>{' '}
            book lovers already on the platform
          </p>
        </motion.div>
      </div>
    </section>
  );
}
