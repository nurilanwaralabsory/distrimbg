import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, Truck, Clock } from "lucide-react"

// Import komponen Scanner & Server Action milik Kurir
import { QrScanner } from "@/components/qr-scanner"
import { updateStatusPengiriman } from "./actions"

export const dynamic = "force-dynamic"

export default async function RuteKurirPage() {
  const supabase = await createClient()

  // Verifikasi Sesi Pengguna
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 1. PERBAIKAN: Hapus kolom 'alamat' karena tidak ada di tabel profiles
  const { data: daftarPengiriman, error: kueriError } = await supabase
    .from("pengiriman")
    .select(
      `
      id,
      status_pengiriman,
      pesanan_id,
      waktu_diambil,
      pesanan:pesanan_id (
        status_masak, 
        kuota_harian (
          jumlah_porsi,
          sekolah:sekolah_id (
            nama
          )
        )
      )
    `
    )
    .in("status_pengiriman", ["menunggu", "diambil"])
    .order("id", { ascending: false })

  // Menampilkan info jika kueri bermasalah
  if (kueriError) {
    console.error("❌ ERROR KUERI KURIR:", kueriError.message)
    return (
      <div className="m-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-500">
        <h2 className="font-bold">Gagal Memuat Data Supabase:</h2>
        <p>{kueriError.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-blue-800">
          <Truck className="size-6" /> Rute Pengantaran Aktif
        </h1>
        <p className="text-muted-foreground">
          Daftar muatan logistik yang harus diproses hari ini.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {daftarPengiriman?.map((item: any) => {
          const statusMasakDapur = item.pesanan?.status_masak
          const jumlahPorsi = item.pesanan?.kuota_harian?.jumlah_porsi || 0
          const namaSekolah =
            item.pesanan?.kuota_harian?.sekolah?.nama || "Instansi"

          // Karena kolom alamat belum ada di tabel profiles, kita set text default dulu bos
          const alamatSekolah = "Alamat Sekolah (Silakan cek profile sekolah)"

          return (
            <Card key={item.id} className="border-blue-100 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    Pengiriman #{item.id}
                  </CardTitle>
                  <Badge
                    variant={
                      item.status_pengiriman === "diambil"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      item.status_pengiriman === "diambil"
                        ? "bg-blue-600 text-white"
                        : statusMasakDapur === "siap_kirim"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-600"
                    }
                  >
                    {item.status_pengiriman === "diambil"
                      ? "Sedang Diantar"
                      : statusMasakDapur === "siap_kirim"
                        ? "Siap Pickup"
                        : "Menunggu Dapur"}
                  </Badge>
                </div>
                <CardDescription className="mt-1 flex items-center gap-1 font-medium text-gray-700">
                  <Package className="size-4" /> {jumlahPorsi} Porsi Makanan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-gray-50 p-3 text-sm">
                  <p className="mb-1 flex items-center gap-1 text-gray-500">
                    <MapPin className="size-4" /> Lokasi Tujuan:
                  </p>
                  <p className="font-semibold text-gray-800">{namaSekolah}</p>
                  <p className="truncate text-gray-600">{alamatSekolah}</p>
                </div>

                {/* Skenario A: Kurir belum ambil, Dapur BELUM selesai */}
                {item.status_pengiriman === "menunggu" &&
                  statusMasakDapur !== "siap_kirim" && (
                    <div className="rounded-md border border-gray-200 bg-gray-100 p-2 text-center text-sm text-gray-500">
                      <span className="animate-pulse">
                        ⏳ Menunggu Dapur Selesai...
                      </span>
                    </div>
                  )}

                {/* Skenario B: Kurir belum ambil, Dapur SUDAH siap kirim */}
                {item.status_pengiriman === "menunggu" &&
                  statusMasakDapur === "siap_kirim" && (
                    <QrScanner
                      pesananIdTarget={item.pesanan_id.toString()}
                      pengirimanId={item.id.toString()}
                      onScanSuccessAction={updateStatusPengiriman}
                    />
                  )}

                {/* Skenario C: Kurir sudah berhasil scan dan mengambil makanan */}
                {item.status_pengiriman === "diambil" && (
                  <div className="space-y-2">
                    <div className="flex w-full items-center justify-center gap-2 rounded-md border border-blue-200 bg-blue-50 p-2 text-center text-sm font-medium text-blue-700">
                      <Clock className="size-4 animate-pulse" /> Makanan dalam
                      perjalanan
                    </div>
                    {item.waktu_diambil && (
                      <p className="text-center text-[10px] text-gray-400">
                        Pickup:{" "}
                        {new Date(item.waktu_diambil).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        WIB
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {(!daftarPengiriman || daftarPengiriman.length === 0) && (
          <div className="col-span-full rounded-xl border border-dashed bg-gray-50 p-8 text-center text-gray-500">
            Tidak ada manifes pengiriman aktif saat ini bos.
          </div>
        )}
      </div>
    </div>
  )
}
