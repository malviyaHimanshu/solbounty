"use client";

export function MedalOutlinedIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.365 14.472 18 22c-4.286-2.664-7.714-2.664-12 0l1.635-7.528m8.73 0a7 7 0 1 0-8.73 0m8.73 0A6.97 6.97 0 0 1 12 16a6.97 6.97 0 0 1-4.365-1.528"/>
    </svg>
  )
}

export function MedalSolidIcon({
  size = 18,
  color = "#18181B"
}: {
  size?: number
  color?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path fill={color} fillRule="evenodd" d="M12 1a8 8 0 0 0-5.468 13.84l-1.51 6.948a1 1 0 0 0 1.506 1.061c2.043-1.27 3.789-1.847 5.472-1.847 1.683 0 3.429.577 5.472 1.847a1 1 0 0 0 1.505-1.061l-1.509-6.949A8 8 0 0 0 12 1ZM7.44 20.081l.865-3.984A7.968 7.968 0 0 0 12 17c1.332 0 2.59-.326 3.695-.903l.865 3.984c-1.534-.706-3.032-1.08-4.56-1.08-1.528 0-3.026.374-4.56 1.08Z" clipRule="evenodd"/>
    </svg>
  )
}
