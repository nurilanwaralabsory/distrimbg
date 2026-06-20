import { type NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  // Jalankan fungsi penjaga dari Supabase yang kita buat tadi
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Middleware ini akan memantau SEMUA rute, KECUALI:
     * - _next/static (file statis CSS/JS)
     * - _next/image (optimasi gambar)
     * - favicon.ico
     * - file berekstensi gambar/vektor
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
