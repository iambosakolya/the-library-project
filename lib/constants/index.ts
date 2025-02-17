export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || 'The Library Project';

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'Web application for the book shop using Next.js';

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: '',
  password: '',
};

export const shippingDetailesDefault = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
};
