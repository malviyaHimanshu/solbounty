"use client";

export function CurrencyIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v18m5-13.5c-.37-1.553-1.675-2.7-3.228-2.7h-3.439C8.493 4.8 7 6.412 7 8.4S8.492 12 10.333 12h3.334C15.507 12 17 13.612 17 15.6s-1.492 3.6-3.333 3.6h-3.439C8.675 19.2 7.37 18.053 7 16.5"/>
    </svg>
  )
}