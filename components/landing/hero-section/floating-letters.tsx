'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LETTERS, PARTICLE_COUNT } from './constants';
import { floatingLetterStyles } from './styles';
import { generateParticles } from './utils';
import { Particle } from './types';

export function FloatingLetters() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(generateParticles(PARTICLE_COUNT, LETTERS));
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className={floatingLetterStyles.particle}
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
