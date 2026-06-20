"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function tugaskanKurir(formData: FormData) {
  const supabase = await createClient()

  // 1. Verifikasi Keamanan (Hanya Admin)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (profile?.role !== "admin") throw new Error("Akses ditolak")

  // 2. Ambil data dari form
  const pesanan_id = formData.get("pesanan_id") as string
  const kurir_id = formData.get("kurir_id") as string

  // 3. Masukkan tugas ke tabel pengiriman
  const { error } = await supabase.from("pengiriman").insert([
    {
      pesanan_id,
      kurir_id,
      status_pengiriman: "menuju_dapur",
    },
  ])

  if (error) {
    console.error("Gagal menugaskan kurir:", error)
  }

  // 4. Refresh halaman
  revalidatePath("/dashboard/logistik/tracking")
}
