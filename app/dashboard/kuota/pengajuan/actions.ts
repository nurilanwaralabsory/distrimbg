"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation" // <--- Pastikan import ini ditambahkan

export async function submitKuota(formData: FormData) {
  const supabase = await createClient()

  // 1. Dapatkan user yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const jumlah_porsi = parseInt(formData.get("jumlah_porsi") as string)
  const tanggal = formData.get("tanggal") as string

  // 2. Insert ke tabel kuota_harian
  const { error } = await supabase.from("kuota_harian").insert([
    {
      sekolah_id: user.id,
      jumlah_porsi,
      tanggal,
      status_approval: "menunggu",
    },
  ])

  // 3. Jika error, lemparkan kembali ke halaman dengan pesan gagal
  if (error) {
    redirect(
      `/dashboard/kuota/pengajuan?message=Gagal mengajukan kuota: ${error.message}`
    )
  }

  // 4. Jika sukses, perbarui data dan lemparkan dengan pesan berhasil
  revalidatePath("/dashboard/kuota/pengajuan")
  redirect("/dashboard/kuota/pengajuan?message=Kuota berhasil diajukan!")
}
