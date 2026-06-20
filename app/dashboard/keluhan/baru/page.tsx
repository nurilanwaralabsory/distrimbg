import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { submitKeluhan } from "./actions"
import {
  Table,
  TableBody,
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
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  MessageSquareWarning,
} from "lucide-react"
import { SubmitButton } from "@/components/submit-button"

export default async function BuatKeluhanPage(props: {
  searchParams: Promise<{ message?: string }>
}) {
  const searchParams = await props.searchParams
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
    currentUserProfile?.role !== "sekolah" &&
    currentUserProfile?.role !== "admin"
  ) {
    redirect("/dashboard")
  }

  // 2. Ambil Riwayat Pesanan untuk Dropdown Pilihan
  // Menggunakan inner join untuk memastikan hanya mengambil pesanan milik sekolah ini
  const { data: daftarPesanan } = await supabase
    .from("pesanan")
    .select(
      `
      id,
      kuota_harian!inner (
        tanggal,
        jumlah_porsi,
        sekolah_id
      )
    `
    )
    .eq("kuota_harian.sekolah_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10) // Tampilkan 10 pesanan terakhir saja

  // 3. Ambil Riwayat Keluhan Sekolah Ini
  const { data: riwayatKeluhan } = await supabase
    .from("keluhan")
    .select("*")
    .eq("sekolah_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Pusat Bantuan & Laporan
        </h1>
        <p className="text-muted-foreground">
          Sampaikan kendala distribusi atau kualitas makanan kepada Admin.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* FORM INPUT KELUHAN */}
        <Card className="h-fit border-red-100 shadow-sm lg:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquareWarning className="size-5" /> Buat Laporan Baru
            </CardTitle>
            <CardDescription>Formulir komplain operasional.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={submitKeluhan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pesanan_id">Pilih Pesanan Bermasalah</Label>
                <Select name="pesanan_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih riwayat pengiriman..." />
                  </SelectTrigger>
                  <SelectContent>
                    {daftarPesanan?.map((psn: any) => (
                      <SelectItem key={psn.id} value={psn.id.toString()}>
                        {new Date(psn.kuota_harian.tanggal).toLocaleDateString(
                          "id-ID"
                        )}{" "}
                        ({psn.kuota_harian.jumlah_porsi} Porsi) - ID: {psn.id}
                      </SelectItem>
                    ))}
                    {daftarPesanan?.length === 0 && (
                      <SelectItem value="0" disabled>
                        Belum ada riwayat pesanan
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesan">Pesan Kendala / Deskripsi</Label>
                <Textarea
                  id="pesan"
                  name="pesan"
                  placeholder="Misal: Porsi kurang 5 kotak, atau makanan basi saat diterima..."
                  className="min-h-[120px]"
                  required
                />
              </div>

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
                  <AlertDescription className="font-medium">
                    {searchParams.message}
                  </AlertDescription>
                </Alert>
              )}

              <SubmitButton text="Kirim Laporan" loadingText="Mengirim..." />
            </form>
          </CardContent>
        </Card>

        {/* TABEL RIWAYAT KELUHAN */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Riwayat Laporan Anda</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu Laporan</TableHead>
                  <TableHead>Ref. Pesanan (ID)</TableHead>
                  <TableHead>Pesan Keluhan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riwayatKeluhan?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="min-w-[140px] font-medium text-gray-600">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        dateStyle: "medium",
                      })}
                      <div className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                        #{item.pesanan_id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="line-clamp-2 text-sm text-gray-700"
                        title={item.pesan}
                      >
                        {item.pesan}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`flex w-fit items-center gap-1 font-medium capitalize ${
                          item.status === "menunggu"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : item.status === "diproses"
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-green-200 bg-green-50 text-green-700"
                        }`}
                      >
                        {item.status === "menunggu" && (
                          <Clock className="size-3" />
                        )}
                        {item.status === "diproses" && (
                          <AlertCircle className="size-3" />
                        )}
                        {item.status === "selesai" && (
                          <CheckCircle2 className="size-3" />
                        )}
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}

                {riwayatKeluhan?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-10 text-center text-gray-500"
                    >
                      Anda belum pernah mengajukan laporan keluhan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
