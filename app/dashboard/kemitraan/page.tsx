import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { KemitraanTable } from "./kemitraan-table"

export default async function KemitraanPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (currentUserProfile?.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-red-600">Akses Ditolak!</h2>
        <p className="mt-2 text-gray-500">
          Halaman ini dikhususkan untuk Administrator DistriMBG.
        </p>
      </div>
    )
  }

  // Ambil semua profil
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="p-4 text-red-500">Gagal memuat data: {error.message}</div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Manajemen Kemitraan
        </h1>
        <p className="text-muted-foreground">
          Daftar seluruh entitas yang terdaftar dalam jaringan logistik
          DistriMBG.
        </p>
      </div>

      {/* Panggil komponen tabel yang kita buat */}
      <KemitraanTable profiles={profiles || []} />
    </div>
  )
}
