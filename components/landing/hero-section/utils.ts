import { Particle } from './types';

/**
 * Generate an array of random floating letter particles.
 */
export function generateParticles(
  count: number,
  letters: string[],
): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    char: letters[Math.floor(Math.random() * letters.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 10 + Math.random() * 16,
    dur: 12 + Math.random() * 18,
  }));
}
