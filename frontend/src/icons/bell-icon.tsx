"use client";

export function BellOutlinedIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.159 17.724a59.522 59.522 0 0 1-3.733-.297 1.587 1.587 0 0 1-1.33-2.08c.161-.485.324-.963.367-1.478l.355-4.26a7.207 7.207 0 0 1 14.365 0l.355 4.262c.043.515.206.993.367 1.479a1.587 1.587 0 0 1-1.33 2.077 59.5 59.5 0 0 1-3.732.297m-5.684 0c1.893.09 3.79.09 5.684 0m-5.684 0v.434a2.842 2.842 0 1 0 5.684 0v-.434"/>
    </svg>
  )
}

export function BellSolidIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path fill={color} fillRule="evenodd" d="M3.822 9.526a8.207 8.207 0 0 1 16.358 0l.355 4.262c.03.374.15.735.32 1.246a2.587 2.587 0 0 1-2.17 3.387c-.957.106-1.916.19-2.876.25a3.843 3.843 0 0 1-7.616 0 59.05 59.05 0 0 1-2.877-.25 2.588 2.588 0 0 1-2.17-3.39c.171-.51.29-.872.32-1.245l.356-4.26Zm6.44 9.24a1.843 1.843 0 0 0 3.478 0l-.294.008a60.59 60.59 0 0 1-3.184-.008Z" clipRule="evenodd"/>
    </svg>
  )
}
