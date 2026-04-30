export const ctaStyles = {
  section:
    'relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary py-24 md:py-32',
  blobContainer: 'pointer-events-none absolute inset-0',
  blobLeft:
    'absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl',
  blobRight:
    'absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/5 blur-3xl',
  floatingIconLeft: 'absolute left-[10%] top-[20%]',
  floatingIconRight: 'absolute bottom-[25%] right-[15%]',
  floatingIconStyle: 'h-8 w-8 text-primary-foreground/10',
  floatingIconSmallStyle: 'h-6 w-6 text-primary-foreground/10',
  container:
    'relative z-10 mx-auto w-full px-6 text-center md:px-12 xl:px-20 2xl:px-32',
  title:
    'text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl',
  subtitle: 'mx-auto mt-5 max-w-xl text-lg text-primary-foreground/70',
  form: 'mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row',
  input:
    'h-12 flex-1 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/40',
  submitButton:
    'group gap-2 bg-primary-foreground text-primary shadow-lg hover:bg-primary-foreground/90',
  socialProof: 'mt-6 text-sm text-primary-foreground/50',
  socialProofHighlight: 'font-semibold text-primary-foreground/70',
};
