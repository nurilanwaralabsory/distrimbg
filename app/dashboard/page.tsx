import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { OverviewChart } from "@/components/overview-chart"
import {
  Store,
  GraduationCap,
  AlertCircle,
  Utensils,
  Activity,
} from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Verifikasi Sesi & Role
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("nama, role")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/login")

  // --- JIKA BUKAN ADMIN: Tampilkan Welcome Screen Sederhana ---
  if (profile.role !== "admin") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Selamat Datang, {profile.nama}!
          </h1>
          <p className="text-muted-foreground capitalize">
            Anda login sebagai: {profile.role}
          </p>
        </div>
        <Card className="border-blue-100 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Activity className="size-5" /> Siap Bertugas
            </CardTitle>
            <CardDescription className="text-blue-600">
              Silakan gunakan menu di sebelah kiri untuk mulai mengelola
              aktivitas operasional Anda hari ini.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // --- JIKA ADMIN: Tarik Data Statistik Hari Ini ---
  const today = new Date().toISOString().split("T")[0]

  // A. Hitung Total Sekolah
  const { count: countSekolah } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "sekolah")

  // B. Hitung Total Dapur
  const { count: countDapur } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "dapur")

  // C. Hitung Keluhan Menunggu
  const { count: countKeluhan } = await supabase
    .from("keluhan")
    .select("*", { count: "exact", head: true })
    .eq("status", "menunggu")

  // D. Hitung Total Porsi yang Disetujui Hari Ini
  const { data: kuotaHariIni } = await supabase
    .from("kuota_harian")
    .select("jumlah_porsi")
    .eq("tanggal", today)
    .eq("status_approval", "disetujui")

  const totalPorsiHariIni =
    kuotaHariIni?.reduce((sum, item) => sum + item.jumlah_porsi, 0) || 0

  // E. Ambil Data Asli untuk Grafik (7 Hari Terakhir)
  const tujuhHariLalu = new Date()
  tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 6) // Mundur 6 hari dari hari ini
  const startDate = tujuhHariLalu.toISOString().split("T")[0]

  const { data: rawGrafikData } = await supabase
    .from("kuota_harian")
    .select("tanggal, jumlah_porsi")
    .eq("status_approval", "disetujui")
    .gte("tanggal", startDate)
    .order("tanggal", { ascending: true })

  // Siapkan map kosong untuk 7 hari agar grafik tidak bolong jika tidak ada pesanan di hari tertentu
  const petaData = new Map<string, number>()
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    petaData.set(d.toISOString().split("T")[0], 0)
  }

  // Isi data porsi dari database ke dalam map tanggal
  if (rawGrafikData) {
    rawGrafikData.forEach((item) => {
      const currentTotal = petaData.get(item.tanggal) || 0
      petaData.set(item.tanggal, currentTotal + item.jumlah_porsi)
    })
  }

  // Format array untuk diumpan ke Recharts
  const formatHariIndo = new Intl.DateTimeFormat("id-ID", { weekday: "short" })
  const chartData = Array.from(petaData.entries()).map(([tanggal, total]) => {
    const dateObj = new Date(tanggal)
    return {
      name: formatHariIndo.format(dateObj), // Menghasilkan: "Sen", "Sel", "Rab", dll.
      total: total,
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Ringkasan aktivitas operasional DistriMBG hari ini.
        </p>
      </div>

      {/* DERETAN KARTU STATISTIK (ANGKA PENTING) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mitra Sekolah</CardTitle>
            <GraduationCap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countSekolah || 0}</div>
            <p className="text-xs text-muted-foreground">Instansi terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dapur Umum</CardTitle>
            <Store className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countDapur || 0}</div>
            <p className="text-xs text-muted-foreground">Unit produksi aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Target Porsi Hari Ini
            </CardTitle>
            <Utensils className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalPorsiHariIni}
            </div>
            <p className="text-xs text-muted-foreground">
              Porsi makanan disetujui
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            countKeluhan && countKeluhan > 0 ? "border-red-200 bg-red-50" : ""
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Keluhan Menunggu
            </CardTitle>
            <AlertCircle
              className={`size-4 ${countKeluhan && countKeluhan > 0 ? "text-red-500" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${countKeluhan && countKeluhan > 0 ? "text-red-600" : ""}`}
            >
              {countKeluhan || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Butuh tindak lanjut segera
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AREA GRAFIK */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Tren Distribusi Mingguan</CardTitle>
            <CardDescription>
              Total porsi makanan yang disalurkan dalam 6 hari terakhir.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Status Sistem</CardTitle>
            <CardDescription>Log aktivitas cepat.</CardDescription>
          </CardHeader>
          <CardContent className="m-6 flex h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-100 bg-gray-50/50 text-center">
            <Activity className="mb-4 size-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">
              Semua sistem logistik berjalan normal.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Gunakan sidebar untuk navigasi lebih lanjut.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
