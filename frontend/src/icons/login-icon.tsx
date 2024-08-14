"use client";

export function LoginIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.812 9a15.002 15.002 0 0 0-2.655 2.556A.703.703 0 0 0 8 12m2.812 3a15 15 0 0 1-2.655-2.556A.703.703 0 0 1 8 12m0 0h13m-8-7.472A6 6 0 0 0 3 9v6a6 6 0 0 0 10 4.472"/>
    </svg>
  )
}

export function LogoutIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.189 9a15 15 0 0 1 2.654 2.556c.105.13.157.287.157.444m-2.811 3a14.998 14.998 0 0 0 2.654-2.556A.704.704 0 0 0 21 12m0 0H8m5-7.472A6 6 0 0 0 3 9v6a6 6 0 0 0 10 4.472"/>
    </svg>
  )
}