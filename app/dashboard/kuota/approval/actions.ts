"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function ubahStatusKuota(formData: FormData) {
  const supabase = await createClient()

  // 1. Verifikasi Keamanan Admin
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
  const id = formData.get("id") as string // Ini id dari kuota_harian
  const status = formData.get("status") as string
  const dapur_id = formData.get("dapur_id") as string

  // 3. Update status di tabel kuota_harian
  const { error: errorUpdate } = await supabase
    .from("kuota_harian")
    .update({ status_approval: status })
    .eq("id", id)

  if (errorUpdate) console.error("Gagal update status:", errorUpdate)

  // 4. JIKA DISETUJUI, BUAT TUGAS BARU DI TABEL PESANAN
  if (status === "disetujui" && dapur_id) {
    const { error: errorInsert } = await supabase.from("pesanan").insert([
      {
        kuota_id: parseInt(id), // Ubah jadi integer sesuai database baru kita
        dapur_id: dapur_id,
        status_masak: "menunggu",
      },
    ])

    if (errorInsert) console.error("Gagal membuat pesanan:", errorInsert)
  }

  // 5. Refresh halaman
  revalidatePath("/dashboard/kuota/approval")
}
