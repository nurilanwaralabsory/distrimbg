"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AutoRefreshDapur() {
  const router = useRouter()

  useEffect(() => {
    // Memaksa Next.js menarik data terbaru dari database setiap 5 detik
    // Proses ini berjalan mulus di background tanpa layar berkedip putih
    const interval = setInterval(() => {
      router.refresh()
    }, 5000)

    // Bersihkan interval jika komponen ditutup
    return () => clearInterval(interval)
  }, [router])

  return null // Komponen ini tidak menampilkan wujud UI apa-apa (invisible)
}
