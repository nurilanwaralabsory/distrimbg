"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateStatusKeluhan(formData: FormData) {
  const supabase = await createClient()

  // 1. Proteksi: Hanya Admin yang boleh mengubah status
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (profile?.role !== "admin") {
    throw new Error("Akses ditolak: Hanya Admin yang dapat memproses keluhan.")
  }

  // 2. Ambil data dari form
  const id = parseInt(formData.get("id") as string)
  const status = formData.get("status") as string

  // 3. Update status keluhan di database
  const { error } = await supabase
    .from("keluhan")
    .update({ status })
    .eq("id", id)

  if (error) {
    console.error("Gagal update keluhan:", error)
    return
  }

  // 4. Refresh halaman
  revalidatePath("/dashboard/keluhan/masuk")
}
