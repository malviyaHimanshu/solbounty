"use client";

export function HomeOutlinedIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 21v-5a3 3 0 1 0-6 0v5m6 0c1.977-.002 3.013-.027 3.816-.436a4 4 0 0 0 1.748-1.748C21 17.96 21 16.84 21 14.6v-1.841c0-1.017 0-1.526-.119-2.002a4 4 0 0 0-.513-1.19c-.265-.414-.634-.763-1.374-1.461l-2.6-2.456c-1.546-1.46-2.32-2.19-3.201-2.466a4 4 0 0 0-2.386 0c-.882.275-1.655 1.006-3.201 2.466l-2.6 2.456c-.74.698-1.11 1.047-1.374 1.46a4 4 0 0 0-.513 1.191C3 11.233 3 11.742 3 12.76v1.84c0 2.24 0 3.36.436 4.216a4 4 0 0 0 1.748 1.748c.803.41 1.84.434 3.816.436m6 0H9"/>
    </svg>
  )
}

export function HomeSolidIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path fill={color} d="M10.51 2.23a5 5 0 0 1 2.98 0c.61.19 1.136.525 1.681.963.528.425 1.132.996 1.88 1.702l2.716 2.565c.657.62 1.111 1.049 1.443 1.567.293.458.51.96.642 1.488.148.598.148 1.222.148 2.125v2.003c0 1.084 0 1.958-.058 2.666-.06.729-.185 1.369-.487 1.96a5 5 0 0 1-2.185 2.186c-.556.284-1.154.411-1.827.475-.421.04-.9.057-1.443.064V16a4 4 0 0 0-8 0v5.994a18.073 18.073 0 0 1-1.443-.064c-.673-.064-1.27-.192-1.827-.475a5 5 0 0 1-2.185-2.185c-.302-.592-.428-1.232-.487-1.961C2 16.6 2 15.727 2 14.643V12.64c0-.903 0-1.527.148-2.125a5 5 0 0 1 .642-1.488c.332-.518.786-.947 1.443-1.567l2.716-2.565c.748-.706 1.352-1.277 1.88-1.702.545-.438 1.071-.773 1.68-.964Z"/>
      <path fill={color} d="M14 22h-4v-6a2 2 0 1 1 4 0v6Z"/>
    </svg>
  )
}
