import { Instrument_Serif, Inter, Cormorant_Garamond, PT_Serif, Inter_Tight } from "next/font/google";

export const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
});

export const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic']
});

export const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic']
});

export const coromorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic']
})

export const ptSerif = PT_Serif({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic']
})