"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // 1. Buat state untuk melacak apakah komponen sudah terpasang (mounted) di peramban
  const [isMounted, setIsMounted] = React.useState(false)

  // 2. Gunakan useEffect agar status berubah menjadi true HANYA setelah render pertama selesai
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // 3. Selama belum terpasang, kembalikan children biasa TANPA NextThemesProvider
  // Ini mencegah React 19 marah karena mendeteksi script tag terlalu dini
  if (!isMounted) {
    return <>{children}</>
  }

  // 4. Setelah aman, baru jalankan provider temanya
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
