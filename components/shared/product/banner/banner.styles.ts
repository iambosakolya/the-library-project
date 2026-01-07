export const bannerStyles = {
  root: 'w-full overflow-hidden',
  content: 'flex flex-col items-center gap-4 p-4 sm:flex-row sm:gap-6 sm:p-6',
  mainImage:
    'h-auto w-full max-w-full object-contain sm:w-auto sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px]',
  textWrapper: 'flex-1 text-center sm:text-left',
  title: 'text-xl font-bold sm:text-2xl md:text-3xl',
  subtitle: 'mt-2 text-base text-gray-600 sm:text-lg md:text-xl',
  bottomBanner: 'hidden h-auto w-full lg:block',
} as const;
