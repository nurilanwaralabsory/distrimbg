import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { tugaskanKurir } from "./actions"
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
import { Truck, MapPin, Package, CheckCircle2 } from "lucide-react"

export default async function TrackingArmadaPage() {
  const supabase = await createClient()

  // 1. Proteksi Halaman
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (currentUserProfile?.role !== "admin") redirect("/dashboard")

  // 2. Ambil Data Pesanan beserta Relasinya
  const { data: daftarPesanan } = await supabase
    .from("pesanan")
    .select(
      `
      id,
      status_masak,
      dapur:profiles!pesanan_dapur_id_fkey(nama),
      kuota_harian (
        jumlah_porsi,
        sekolah:profiles!kuota_harian_sekolah_id_fkey(nama)
      ),
      pengiriman (
        id,
        status_pengiriman,
        kurir:profiles!pengiriman_kurir_id_fkey(nama)
      )
    `
    )
    .order("created_at", { ascending: false })

  // 3. Ambil Daftar Kurir yang Tersedia
  const { data: daftarKurir } = await supabase
    .from("profiles")
    .select("id, nama")
    .eq("role", "kurir")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Pelacakan Armada & Logistik
        </h1>
        <p className="text-muted-foreground">
          Monitor status masakan dapur dan tugaskan kurir untuk pengantaran.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dapur Produksi</TableHead>
              <TableHead>Sekolah Tujuan</TableHead>
              <TableHead>Status Dapur</TableHead>
              <TableHead>Status Pengiriman</TableHead>
              <TableHead className="text-right">Aksi Penugasan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {daftarPesanan?.map((item: any) => {
              // Parsing relasi yang ditarik dari Supabase
              const namaDapur = item.dapur?.nama || "Unknown"
              const namaSekolah = item.kuota_harian?.sekolah?.nama || "Unknown"
              const jumlahPorsi = item.kuota_harian?.jumlah_porsi

              // Karena pengiriman adalah array (1-to-many relasi di supabase by default)
              const pengirimanAktif =
                item.pengiriman && item.pengiriman.length > 0
                  ? item.pengiriman[0]
                  : null
              const namaKurir = pengirimanAktif?.kurir?.nama

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-semibold text-orange-700">
                    {namaDapur}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{namaSekolah}</div>
                    <div className="text-xs text-gray-500">
                      {jumlahPorsi} Porsi
                    </div>
                  </TableCell>

                  {/* Badge Status Masak */}
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.status_masak.replace("_", " ")}
                    </Badge>
                  </TableCell>

                  {/* Badge Status Pengiriman */}
                  <TableCell>
                    {pengirimanAktif ? (
                      <Badge
                        variant="default"
                        className="flex w-fit items-center gap-1 bg-blue-100 text-blue-800 capitalize hover:bg-blue-100"
                      >
                        <Truck className="size-3" />
                        {pengirimanAktif.status_pengiriman.replace("_", " ")}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Belum ada kurir
                      </span>
                    )}
                  </TableCell>

                  {/* Aksi Penugasan */}
                  <TableCell className="text-right">
                    {/* Jika masakan sudah siap kirim dan belum ada kurir yang ditugaskan */}
                    {item.status_masak === "siap_kirim" && !pengirimanAktif ? (
                      <form
                        action={tugaskanKurir}
                        className="flex items-center justify-end gap-2"
                      >
                        <input
                          type="hidden"
                          name="pesanan_id"
                          value={item.id}
                        />
                        <select
                          name="kurir_id"
                          required
                          className="min-w-[140px] rounded-md border bg-gray-50 px-2 py-1.5 text-sm"
                        >
                          <option value="">-- Pilih Kurir --</option>
                          {daftarKurir?.map((kurir) => (
                            <option key={kurir.id} value={kurir.id}>
                              {kurir.nama}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="submit"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Tugaskan
                        </Button>
                      </form>
                    ) : pengirimanAktif ? (
                      // Jika sudah ditugaskan, tampilkan nama kurirnya
                      <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                        <Package className="size-4 text-blue-500" />
                        Dibawa oleh:{" "}
                        <span className="font-semibold">{namaKurir}</span>
                      </div>
                    ) : (
                      // Jika status masak masih belum siap
                      <span className="flex items-center justify-end gap-1 text-xs text-orange-500 italic">
                        <MapPin className="size-3" /> Menunggu Dapur
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}

            {daftarPesanan?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-gray-500"
                >
                  Belum ada data pesanan operasional hari ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
