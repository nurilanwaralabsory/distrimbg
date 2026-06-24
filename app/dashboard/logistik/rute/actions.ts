"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateStatusPengiriman(formData: FormData) {
  const supabase = await createClient()

  // 1. Cek Sesi
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Sesi tidak ditemukan. Silakan login kembali." }

  // 2. Cek Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "kurir" && profile?.role !== "admin") {
    return { error: "Akses ditolak: Akun Anda tidak memiliki role kurir." }
  }

  const id = formData.get("id") as string
  const status_pengiriman = formData.get("status_pengiriman") as string

  const updateData: any = { status_pengiriman }
  const waktuSekarang = new Date().toISOString()

  if (status_pengiriman === "diambil") {
    updateData.waktu_diambil = waktuSekarang
  } else if (status_pengiriman === "terkirim") {
    updateData.waktu_terkirim = waktuSekarang
  }

  // 3. Eksekusi Update
  const { error } = await supabase
    .from("pengiriman")
    .update(updateData)
    .eq("id", id)

  // JIKA GAGAL, KEMBALIKAN PESAN ERROR KE CLIENT
  if (error) {
    console.error("Gagal update Supabase:", error.message)
    return { error: `Gagal database: ${error.message}` }
  }

  // JIKA SUKSES
  revalidatePath("/dashboard/logistik/rute")
  return { success: true }
}
