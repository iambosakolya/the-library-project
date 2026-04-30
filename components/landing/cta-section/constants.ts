export const CTA_RESET_DELAY = 4000;

export const BLOB_ANIMATIONS = {
  left: {
    animate: { scale: [1, 1.2, 1] },
    transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' as const },
  },
  right: {
    animate: { scale: [1, 1.15, 1] },
    transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

export const FLOATING_ICON_ANIMATIONS = {
  left: {
    animate: { y: [0, -15, 0], rotate: [0, 8, 0] },
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const },
  },
  right: {
    animate: { y: [0, -12, 0], rotate: [0, -6, 0] },
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: 2,
    },
  },
};
