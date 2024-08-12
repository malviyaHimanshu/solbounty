import { NextUIProvider } from "@nextui-org/react";


export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  )
}