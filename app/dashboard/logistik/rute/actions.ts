"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateStatusPengiriman(formData: FormData) {
  const supabase = await createClient()

  // Proteksi Keamanan
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "kurir" && profile?.role !== "admin") {
    throw new Error("Akses ditolak")
  }

  const id = formData.get("id") as string
  const status_pengiriman = formData.get("status_pengiriman") as string

  // Siapkan objek data untuk diupdate
  const updateData: any = { status_pengiriman }

  // Catat timestamps otomatis sesuai titik perpindahan logistik
  const waktuSekarang = new Date().toISOString()
  if (status_pengiriman === "diambil") {
    updateData.waktu_diambil = waktuSekarang
  } else if (status_pengiriman === "terkirim") {
    updateData.waktu_terkirim = waktuSekarang
  }

  // Eksekusi update ke tabel pengiriman
  const { error } = await supabase
    .from("pengiriman")
    .update(updateData)
    .eq("id", id)

  if (error) {
    console.error("Gagal memperbarui status pengiriman:", error)
  }

  revalidatePath("/dashboard/logistik/rute")
}
