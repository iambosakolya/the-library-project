import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert prisma object into a reqular js obj
export function convertToPlainObj<T>(value: T) {
  return JSON.parse(JSON.stringify(value));
}