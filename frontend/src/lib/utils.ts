import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken'
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

export function createToken(payload: object): string {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  if (!secret || !expiresIn) {
    throw new Error('JWT_SECRET and JWT_EXPIRES_IN must be defined in the environment variables');
  }

  const token = jwt.sign(payload, secret, {
    expiresIn,
  });

  return token;
}

export function verifyToken(token: any): any {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET must be defined in the environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch(error) {
    console.error('Error verifying token: ', error);
    return null;
  }
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