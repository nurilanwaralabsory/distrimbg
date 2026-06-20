import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { updateStatusMasak } from "./actions"
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
import { ChefHat, Package, CheckSquare, Clock } from "lucide-react"
import { QrGenerator } from "@/components/qr-generator" // <--- Import sudah benar

export default async function PesananDapurPage() {
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

  if (
    currentUserProfile?.role !== "dapur" &&
    currentUserProfile?.role !== "admin"
  ) {
    redirect("/dashboard")
  }

  // 2. Ambil Data Pesanan Khusus untuk Dapur Ini (Nested Join)
  const { data: daftarPesanan, error } = await supabase
    .from("pesanan")
    .select(
      `
      id,
      status_masak,
      created_at,
      kuota_harian (
        tanggal,
        jumlah_porsi,
        profiles:sekolah_id (nama)
      )
    `
    )
    .eq("dapur_id", user.id)
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
          Daftar Tugas Produksi
        </h1>
        <p className="text-muted-foreground">
          Kelola pesanan masakan yang dialokasikan ke dapur Anda.
        </p>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableCaption>Daftar pesanan aktif untuk hari ini.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tgl. Distribusi</TableHead>
              <TableHead>Tujuan (Sekolah)</TableHead>
              <TableHead>Target Porsi</TableHead>
              <TableHead>Status Dapur</TableHead>
              <TableHead className="text-right">Update Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {daftarPesanan?.map((item: any) => {
              const tanggal = item.kuota_harian?.tanggal
              const jumlahPorsi = item.kuota_harian?.jumlah_porsi
              const namaSekolah =
                item.kuota_harian?.profiles?.nama || "Tidak diketahui"

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {tanggal
                      ? new Date(tanggal).toLocaleDateString("id-ID", {
                          dateStyle: "medium",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>{namaSekolah}</TableCell>
                  <TableCell className="font-bold text-orange-600">
                    {jumlahPorsi} Porsi
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="flex w-fit items-center gap-1 bg-gray-50 font-medium capitalize"
                    >
                      {item.status_masak === "menunggu" && (
                        <Clock className="size-3 text-gray-500" />
                      )}
                      {item.status_masak === "dimasak" && (
                        <ChefHat className="size-3 text-orange-500" />
                      )}
                      {item.status_masak === "dikemas" && (
                        <Package className="size-3 text-blue-500" />
                      )}
                      {item.status_masak === "siap_kirim" && (
                        <CheckSquare className="size-3 text-green-500" />
                      )}
                      {item.status_masak.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-end text-right">
                    <form
                      action={updateStatusMasak}
                      className="flex justify-end"
                    >
                      <input type="hidden" name="id" value={item.id} />

                      {item.status_masak === "menunggu" && (
                        <>
                          <input
                            type="hidden"
                            name="status_masak"
                            value="dimasak"
                          />
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            <ChefHat className="mr-2 size-4" /> Mulai Masak
                          </Button>
                        </>
                      )}

                      {item.status_masak === "dimasak" && (
                        <>
                          <input
                            type="hidden"
                            name="status_masak"
                            value="dikemas"
                          />
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Package className="mr-2 size-4" /> Selesai & Kemas
                          </Button>
                        </>
                      )}

                      {item.status_masak === "dikemas" && (
                        <>
                          <input
                            type="hidden"
                            name="status_masak"
                            value="siap_kirim"
                          />
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckSquare className="mr-2 size-4" /> Siap Dikirim
                          </Button>
                        </>
                      )}
                    </form>

                    {/* KOMPONEN QR CODE DIPANGGIL DI SINI */}
                    {item.status_masak === "siap_kirim" && (
                      <div className="ml-2">
                        <QrGenerator pesananId={item.id} />
                      </div>
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
                  Belum ada pesanan yang ditugaskan ke dapur Anda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
