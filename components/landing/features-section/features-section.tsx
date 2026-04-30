'use client';

import { motion } from 'framer-motion';

import { useIntersection } from '../use-intersection';

import { contentStyles } from '../shared/styles';
import { FeatureCard } from './feature-card';
import { features } from './constants';
import { featuresStyles } from './styles';

export default function FeaturesSection() {
  const { ref } = useIntersection();

  return (
    <section ref={ref} className={featuresStyles.section}>
      <div className={featuresStyles.container}>
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={featuresStyles.headingWrapper}
        >
          <span className={featuresStyles.badge}>Everything you need</span>
          <h2 className={featuresStyles.title}>
            Built for Readers,{' '}
            <span className={contentStyles.gradientText}>by Readers</span>
          </h2>
          <p className={featuresStyles.subtitle}>
            Everything you need to connect, share, and grow as a reader — all in
            one place.
          </p>
        </motion.div>

        {/* cards grid */}
        <div className={featuresStyles.grid}>
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
