"use client";

export function FlagOutlinedIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v18m1.472-7.483a6.59 6.59 0 0 1 5.377.522 6.589 6.589 0 0 0 5.218.573l1.309-.405A.886.886 0 0 0 19 13.36V4.485c0-.89-1.666-.067-2.045.05A6.028 6.028 0 0 1 12 3.904a6.028 6.028 0 0 0-4.955-.633L5.6 3.717a.85.85 0 0 0-.6.813v8.927c0 .756 1.138.173 1.472.06Z"/>
    </svg>
  )
}

export function FlagSolidIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path fill={color} d="M12.526 3.052a7.028 7.028 0 0 0-5.777-.738l-.843.261A1 1 0 0 0 4 3v18a1 1 0 1 0 2 0v-6.253a4.78 4.78 0 0 0 .458-.152c.074-.028.144-.056.2-.079l.026-.01a6.39 6.39 0 0 1 .076-.03l.023-.009.006-.002h.002a5.59 5.59 0 0 1 4.562.442 7.589 7.589 0 0 0 6.01.66l1.309-.405A1.886 1.886 0 0 0 20 13.36V4.485c0-.267-.064-.577-.27-.854a1.351 1.351 0 0 0-.723-.492c-.423-.12-.857-.04-1.117.02-.298.07-.591.176-.811.26-.082.03-.162.062-.229.088l-.063.025a6.058 6.058 0 0 1-.128.048 5.028 5.028 0 0 1-4.133-.528Z"/>
    </svg>
  )
}
