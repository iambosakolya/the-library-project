export const productFormStyles = {
  form: 'space-y-8',
  fieldRow: 'flex flex-col gap-5 md:flex-row',
  fieldFull: 'w-full',
  saleToggle: 'flex items-center gap-3',
  saleLabel:
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  imageCard: 'mt-2 min-h-48 space-y-2',
  imageGrid: 'flex flex-wrap gap-2',
  imageWrapper: 'group relative',
  image: 'h-20 w-20 rounded-sm object-cover object-center',
  imageRemoveBtn:
    'absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100',
  imageRemoveIcon: 'h-3 w-3',
  submitButton: 'button col-span-2 w-full',
  generateSlugBtn: 'mt-2 bg-gray-500 px-4 py-1 text-white hover:bg-gray-600',
};
