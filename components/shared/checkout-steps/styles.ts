export const stepsStyles = {
  wrapper: 'flex-between mb-10 flex-col space-x-2 space-y-2 md:flex-row',
  stepActive: 'rounded-full w-56 p-2 text-center text-sm bg-secondary',
  stepInactive: 'rounded-full w-56 p-2 text-center text-sm',
  divider: 'mx-2 w-16 border-t-4 border-gray-300',
};

export const CHECKOUT_STEPS = [
  'User Login',
  'Shipping Detailes',
  'Payment Method',
  'Place Order',
] as const;
