import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { updateStatusKeluhan } from "./actions"
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
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { AlertCircle, Clock, CheckCircle2, ShieldAlert } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ManajemenKeluhanAdminPage() {
  const supabase = await createClient()

  // 1. Proteksi Halaman Admin
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
    redirect("/dashboard")
  }

  // 2. Ambil Semua Data Keluhan + Nama Sekolah yang melapor
  const { data: daftarKeluhan, error } = await supabase
    .from("keluhan")
    .select(
      `
      id,
      pesanan_id,
      pesan,
      status,
      created_at,
      sekolah:sekolah_id (nama)
    `
    )
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Gagal memuat keluhan: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-red-700">
          <ShieldAlert className="size-6" /> Pusat Manajemen Keluhan
        </h1>
        <p className="text-muted-foreground">
          Monitor dan tindak lanjuti laporan kendala operasional dari Sekolah.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Laporan Masuk</CardTitle>
          <CardDescription>
            Pesan keluhan diurutkan dari yang paling terbaru.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Monitoring insiden distribusi makanan.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu Laporan</TableHead>
                <TableHead>Instansi Pelapor</TableHead>
                <TableHead>Ref. Pesanan</TableHead>
                <TableHead className="max-w-[300px]">Detail Keluhan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {daftarKeluhan?.map((item: any) => (
                <TableRow
                  key={item.id}
                  className={item.status === "menunggu" ? "bg-red-50/50" : ""}
                >
                  <TableCell className="min-w-[120px] font-medium text-gray-600">
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      dateStyle: "medium",
                    })}
                    <div className="mt-1 text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </div>
                  </TableCell>

                  <TableCell className="font-semibold text-gray-800">
                    {item.sekolah?.nama || "Instansi Terhapus"}
                  </TableCell>

                  <TableCell>
                    <span className="rounded border bg-gray-100 px-2 py-1 font-mono text-xs">
                      #{item.pesanan_id}
                    </span>
                  </TableCell>

                  <TableCell className="max-w-[300px] whitespace-normal">
                    <p className="text-sm text-gray-700">{item.pesan}</p>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`flex w-fit items-center gap-1 font-medium capitalize ${
                        item.status === "menunggu"
                          ? "border-red-200 bg-red-100 text-red-700"
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

                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <form action={updateStatusKeluhan} className="flex gap-2">
                        <input type="hidden" name="id" value={item.id} />

                        {item.status === "menunggu" && (
                          <>
                            <input
                              type="hidden"
                              name="status"
                              value="diproses"
                            />
                            <Button
                              type="submit"
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Proses Laporan
                            </Button>
                          </>
                        )}

                        {item.status === "diproses" && (
                          <>
                            <input
                              type="hidden"
                              name="status"
                              value="selesai"
                            />
                            <Button
                              type="submit"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="mr-2 size-4" /> Tandai
                              Selesai
                            </Button>
                          </>
                        )}

                        {item.status === "selesai" && (
                          <span className="flex items-center gap-1 text-sm text-gray-400 italic">
                            Resolved
                          </span>
                        )}
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {daftarKeluhan?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-gray-500"
                  >
                    Belum ada laporan keluhan yang masuk. Semuanya aman
                    terkendali!
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
