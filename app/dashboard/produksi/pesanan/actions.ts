"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateStatusMasak(formData: FormData) {
  const supabase = await createClient()

  // 1. Pastikan yang mengakses adalah Dapur (atau Admin)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "dapur" && profile?.role !== "admin") {
    throw new Error("Akses ditolak")
  }

  // 2. Ambil ID pesanan dan status tujuan dari form
  const id = formData.get("id") as string
  const status_masak = formData.get("status_masak") as string

  // 3. Update status di tabel pesanan
  const { error: errorPesanan } = await supabase
    .from("pesanan")
    .update({ status_masak })
    .eq("id", id)

  if (errorPesanan) {
    console.error("Gagal update status masak:", errorPesanan)
    return // Hentikan fungsi jika update pesanan gagal
  }

  // 4. LOGIKA BARU: OTOMATIS BUAT SURAT JALAN UNTUK KURIR
  if (status_masak === "siap_kirim") {
    // Cek dulu apakah pengiriman untuk pesanan ini sudah ada (mencegah data ganda)
    const { data: cekPengiriman } = await supabase
      .from("pengiriman")
      .select("id")
      .eq("pesanan_id", id)
      .maybeSingle()

    // Jika belum ada, buat manifes pengiriman baru
    if (!cekPengiriman) {
      console.log("Mencoba membuat manifes pengiriman untuk pesanan:", id)

      const { error: insertError } = await supabase.from("pengiriman").insert({
        pesanan_id: id,
        status_pengiriman: "menunggu", // Status awal kurir
      })

      // Catat di terminal jika Supabase menolak (misal karena RLS)
      if (insertError) {
        console.error("❌ GAGAL INSERT PENGIRIMAN:", insertError.message)
      } else {
        console.log("✅ SUKSES MEMBUAT MANIFES PENGIRIMAN BARU!")
      }
    }
  }

  // 5. Refresh halaman
  revalidatePath("/dashboard/produksi/pesanan")
}
