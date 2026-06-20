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
  const { error } = await supabase
    .from("pesanan")
    .update({ status_masak })
    .eq("id", id)

  if (error) {
    console.error("Gagal update status masak:", error)
  }

  // 4. Refresh halaman
  revalidatePath("/dashboard/produksi/pesanan")
}
