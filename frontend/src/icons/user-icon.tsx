"use client";

export function UserOutlinedIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm0 8H8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 4 4 0 0 0-4-4Z"/>
    </svg>
  )
}

export function UserCircleOutlinedIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.995 19.147C18.893 17.393 17.367 16 15.5 16h-7c-1.867 0-3.393 1.393-3.495 3.147m13.99 0A9.97 9.97 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.97 9.97 0 0 0 3.005 7.147m13.99 0A9.967 9.967 0 0 1 12 22a9.967 9.967 0 0 1-6.995-2.853M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
    </svg>
  )
}

export function UserSolidIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path fill={color} d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM8 14a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5H8Z"/>
    </svg>  
  )
}

export function UserCircleSolidIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path fill={color} fillRule="evenodd" d="M.5 12C.5 5.649 5.649.5 12 .5S23.5 5.649 23.5 12a11.47 11.47 0 0 1-3.456 8.219A11.468 11.468 0 0 1 12 23.5a11.47 11.47 0 0 1-8.044-3.281A11.47 11.47 0 0 1 .5 12Zm8 3c-1.634 0-3.098.85-3.886 2.144.323.463.688.894 1.09 1.288A8.968 8.968 0 0 0 12 21c2.45 0 4.671-.978 6.295-2.568a9.053 9.053 0 0 0 1.091-1.288C18.598 15.85 17.134 15 15.5 15h-7Zm0-5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z" clipRule="evenodd"/>
    </svg>
  )
}
