import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { submitKuota } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert" // <--- Import Alert dari shadcn

// 1. TAMBAHKAN PROPS SEARCH PARAMS DI SINI
export default async function PengajuanKuotaPage(props: {
  searchParams: Promise<{ message?: string }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  // Proteksi Halaman (Hanya Sekolah & Admin)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (profile?.role !== "sekolah" && profile?.role !== "admin")
    redirect("/dashboard")

  // Ambil Riwayat Pengajuan Sekolah Ini
  const { data: riwayat } = await supabase
    .from("kuota_harian")
    .select("*")
    .eq("sekolah_id", user.id)
    .order("tanggal", { ascending: false })

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Pengajuan Kuota Harian
        </h1>
        <p className="text-muted-foreground">
          Input jumlah porsi makanan sesuai kehadiran siswa hari ini.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* FORM PENGINPUTAN */}
        <Card>
          <CardHeader>
            <CardTitle>Form Pengajuan</CardTitle>
            <CardDescription>
              Pilih tanggal dan tentukan jumlah porsi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={submitKuota} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tanggal">Tanggal Distribusi</Label>
                <Input
                  id="tanggal"
                  name="tanggal"
                  type="date"
                  defaultValue={today}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jumlah_porsi">Jumlah Porsi (Siswa)</Label>
                <Input
                  id="jumlah_porsi"
                  name="jumlah_porsi"
                  type="number"
                  placeholder="Contoh: 150"
                  required
                />
              </div>

              {/* 2. TAMPILKAN PESAN SUKSES/ERROR DI SINI */}
              {searchParams?.message && (
                <Alert
                  variant={
                    searchParams.message.includes("Gagal")
                      ? "destructive"
                      : "default"
                  }
                  className={
                    searchParams.message.includes("Gagal")
                      ? ""
                      : "border-green-500 bg-green-50 text-green-700"
                  }
                >
                  <AlertDescription>{searchParams.message}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Kirim Pengajuan
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* INFO RINGKASAN */}
        <Card className="border-blue-100 bg-blue-50 text-blue-900">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Penting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              • Pengajuan maksimal dilakukan pukul 08.00 WIB setiap harinya.
            </p>
            <p>
              • Perubahan porsi setelah disetujui Admin harap hubungi Pusat
              Bantuan.
            </p>
            <p>
              • Pastikan jumlah porsi akurat untuk menghindari pemborosan
              makanan.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TABEL RIWAYAT (Tetap sama seperti sebelumnya) */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengajuan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jumlah Porsi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riwayat?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      dateStyle: "long",
                    })}
                  </TableCell>
                  <TableCell>{item.jumlah_porsi} Porsi</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status_approval === "disetujui"
                          ? "default"
                          : item.status_approval === "ditolak"
                            ? "destructive"
                            : "secondary"
                      }
                      className="capitalize"
                    >
                      {item.status_approval}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={item.status_approval !== "menunggu"}
                    >
                      Batalkan
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {riwayat?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-gray-400 italic"
                  >
                    Belum ada riwayat pengajuan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
