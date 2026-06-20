import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { updateStatusPengiriman } from "./actions"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Navigation,
  Store,
  GraduationCap,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

// 1. IMPORT KOMPONEN QR SCANNER KITA
import { QrScanner } from "@/components/qr-scanner"

export default async function RuteKurirPage() {
  const supabase = await createClient()

  // Proteksi Halaman
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (
    currentUserProfile?.role !== "kurir" &&
    currentUserProfile?.role !== "admin"
  ) {
    redirect("/dashboard")
  }

  // Ambil data pengiriman (Tambahkan 'id' di dalam pesanan agar QR bisa mencocokkan target)
  const { data: tugasPengiriman, error } = await supabase
    .from("pengiriman")
    .select(
      `
      id,
      status_pengiriman,
      waktu_diambil,
      waktu_terkirim,
      pesanan:pesanan_id (
        id, 
        status_masak,
        dapur:profiles!pesanan_dapur_id_fkey(nama),
        kuota_harian (
          jumlah_porsi,
          sekolah:profiles!kuota_harian_sekolah_id_fkey(nama)
        )
      )
    `
    )
    .eq("kurir_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Gagal memuat tugas rute: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Rute Pengantaran Aktif
        </h1>
        <p className="text-muted-foreground">
          Daftar penugasan distribusi makanan yang harus Anda selesaikan.
        </p>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableCaption>Manajemen manifest logistik kurir harian.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Alur Distribusi (Titik A ➔ B)</TableHead>
              <TableHead>Muatan</TableHead>
              <TableHead>Status Kurir</TableHead>
              <TableHead className="text-right">Aksi Lapangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tugasPengiriman?.map((tugas: any) => {
              const detailPesanan = tugas.pesanan
              const namaDapur = detailPesanan?.dapur?.nama || "Dapur Terhapus"
              const namaSekolah =
                detailPesanan?.kuota_harian?.sekolah?.nama || "Sekolah Terhapus"
              const jumlahPorsi = detailPesanan?.kuota_harian?.jumlah_porsi || 0

              return (
                <TableRow key={tugas.id}>
                  {/* Visualisasi Alur Perjalanan */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center gap-1 font-semibold text-orange-600">
                        <Store className="size-4" /> {namaDapur}
                      </span>
                      <ArrowRight className="size-3 text-gray-400" />
                      <span className="flex items-center gap-1 font-semibold text-blue-600">
                        <GraduationCap className="size-4" /> {namaSekolah}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-gray-700">
                    {jumlahPorsi} Porsi Makanan
                  </TableCell>

                  {/* Status Navigasi Kurir */}
                  <TableCell>
                    <Badge
                      variant={
                        tugas.status_pengiriman === "terkirim"
                          ? "default"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {tugas.status_pengiriman.replace("_", " ")}
                    </Badge>
                  </TableCell>

                  {/* Tombol Interaktif Kurir */}
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      {/* 2. PANGGIL KOMPONEN SCANNER JIKA STATUS MENUJU DAPUR */}
                      {tugas.status_pengiriman === "menuju_dapur" && (
                        <QrScanner
                          pesananIdTarget={detailPesanan.id}
                          pengirimanId={tugas.id}
                          onScanSuccessAction={updateStatusPengiriman}
                        />
                      )}

                      {/* Jika status selain menuju_dapur, gunakan form biasa untuk update */}
                      {(tugas.status_pengiriman === "diambil" ||
                        tugas.status_pengiriman === "dalam_perjalanan" ||
                        tugas.status_pengiriman === "terkirim") && (
                        <form
                          action={updateStatusPengiriman}
                          className="flex justify-end"
                        >
                          <input type="hidden" name="id" value={tugas.id} />

                          {tugas.status_pengiriman === "diambil" && (
                            <>
                              <input
                                type="hidden"
                                name="status_pengiriman"
                                value="dalam_perjalanan"
                              />
                              <Button
                                type="submit"
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Navigation className="mr-2 size-4" /> Mulai
                                Berkendara
                              </Button>
                            </>
                          )}

                          {tugas.status_pengiriman === "dalam_perjalanan" && (
                            <>
                              <input
                                type="hidden"
                                name="status_pengiriman"
                                value="terkirim"
                              />
                              <Button
                                type="submit"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="mr-2 size-4" />{" "}
                                Konfirmasi Tiba di Sekolah
                              </Button>
                            </>
                          )}

                          {tugas.status_pengiriman === "terkirim" && (
                            <span className="flex items-center justify-end gap-1 text-sm font-semibold text-green-600 italic">
                              <CheckCircle className="size-4" /> Selesai Diantar
                            </span>
                          )}
                        </form>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}

            {tugasPengiriman?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-gray-500"
                >
                  Belum ada rute pengiriman yang ditugaskan kepada Anda hari
                  ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
