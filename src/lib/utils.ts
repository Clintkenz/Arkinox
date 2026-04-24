import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanImageUrl(url?: string) {
  if (!url) return '';
  // Don't touch data URLs or external links
  if (url.startsWith('data:') || url.startsWith('http')) return url;
  
  // Handle @/ alias
  if (url.startsWith('@/')) {
    url = url.replace('@/', '/');
  }
  
  // Remove /public/ prefix if present
  let clean = url.replace(/^\/public\//, '/');
  // Replace backslashes with forward slashes
  clean = clean.replace(/\\/g, '/');
  // Ensure it starts with / if it's a local path
  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }
  return clean;
}
