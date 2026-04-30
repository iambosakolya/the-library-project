/** Reusable style objects for hero section */

export const sectionStyles = {
  wrapper:
    'relative min-h-[65vh] overflow-hidden bg-gradient-to-b from-secondary/60 via-background to-background dark:from-secondary/20',
  blobContainer: 'pointer-events-none absolute inset-0 overflow-hidden',
  blobPrimary:
    'absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl',
  blobSecondary:
    'absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-chart-2/10 blur-3xl',
};

export const floatingBookStyles = {
  wrapper: 'pointer-events-none absolute',
  icon: 'text-primary/20 dark:text-primary/15',
  parallaxLayer: 'pointer-events-none absolute inset-0',
};

export const floatingLetterStyles = {
  particle:
    'pointer-events-none absolute select-none font-serif text-primary/[0.06] dark:text-primary/[0.08]',
};



export const tegakiStyles = {
  fontSize: 102,
};
