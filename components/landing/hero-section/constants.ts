export const LETTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

export const PARTICLE_COUNT = 22;

export const FLOATING_BOOKS_CONFIG = [
  { className: 'left-[8%] top-[12%]', delay: 0, rotate: -12, size: 54 },
  { className: 'right-[10%] top-[18%]', delay: 1.5, rotate: 10, size: 42 },
  { className: 'bottom-[20%] left-[22%]', delay: 3, rotate: -6, size: 36 },
  { className: 'bottom-[15%] right-[25%]', delay: 2, rotate: 15, size: 50 },
  { className: 'left-[50%] top-[8%]', delay: 4, rotate: -18, size: 30 },
  { className: 'bottom-[30%] right-[42%]', delay: 2.5, rotate: 8, size: 40 },
];

export const SCROLL_RANGES = {
  bgY: { input: [0, 600], output: [0, 200] },
  textY: { input: [0, 600], output: [0, 80] },
  opacity: { input: [0, 400], output: [1, 0] },
};

export const ANIMATION_DURATIONS = {
  blobPrimary: 12,
  blobSecondary: 14,
  floatingBook: 8,
  headline: 0.7,
  subHeadline: 0.7,
  cta: 0.7,
  heroVisual: 0.9,
};

export const ANIMATION_DELAYS = {
  headline: 0.15,
  subHeadline: 0.3,
  cta: 0.45,
  heroVisual: 0.6,
};
