"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
// Import tambahan khusus untuk jalur Admin
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Ambil data dari form
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(
      "/login?message=Gagal login, periksa kembali email dan password Anda"
    )
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const nama = formData.get("nama") as string
  const role = formData.get("role") as string

  // BYPASS: Gunakan Service Role Key untuk melewati batasan email Supabase
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  // Gunakan perintah auth.admin untuk membuat user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // <--- KUNCI UTAMA: Langsung tembus tanpa kirim email OTP!
    user_metadata: {
      nama,
      role,
    },
  })

  if (error) {
    redirect("/register?message=Gagal mendaftar: " + error.message)
  }

  // Arahkan ke halaman login dengan pesan sukses
  redirect("/login?message=Pendaftaran berhasil! Silakan login.")
}

export async function logout() {
  const supabase = await createClient()

  // Hapus sesi di Supabase
  await supabase.auth.signOut()

  // Arahkan kembali ke halaman login
  redirect("/login")
}
