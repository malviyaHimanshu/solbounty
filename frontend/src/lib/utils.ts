import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function fromNow(date: string): string {
  return dayjs(date).fromNow();
}

export function formateDate(date: string): string {
  return dayjs(date).format('DD MMMM YYYY, hh:mm A');
}

export function shortenAddress(address: string): string {
  if (!address) return "";
  const start = address.slice(0, 4); // First 4 characters
  const end = address.slice(-4); // Last 4 characters
  return `${start}...${end}`;
}