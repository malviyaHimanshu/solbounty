import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken'

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