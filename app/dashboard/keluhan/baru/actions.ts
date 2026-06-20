"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function submitKeluhan(formData: FormData) {
  const supabase = await createClient()

  // 1. Verifikasi User (Hanya Sekolah)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (profile?.role !== "sekolah")
    throw new Error("Hanya sekolah yang dapat membuat laporan.")

  // 2. Ambil data dari form (sesuai kolom database Anda)
  const pesanan_id = parseInt(formData.get("pesanan_id") as string)
  const pesan = formData.get("pesan") as string

  // 3. Masukkan ke database
  const { error } = await supabase.from("keluhan").insert([
    {
      sekolah_id: user.id,
      pesanan_id: pesanan_id,
      pesan: pesan,
      status: "menunggu",
    },
  ])

  if (error) {
    redirect(
      `/dashboard/keluhan/baru?message=Gagal mengirim laporan: ${error.message}`
    )
  }

  // 4. Redirect dengan pesan sukses
  redirect(
    "/dashboard/keluhan/baru?message=Laporan keluhan berhasil dikirim dan akan segera diproses Admin!"
  )
}
