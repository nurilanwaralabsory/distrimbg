import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ubahStatusKuota } from "./actions"
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
import { CheckCircle2, XCircle, Clock } from "lucide-react"

export default async function ApprovalKuotaPage() {
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

  // 2. Ambil Semua Data Pengajuan
  const { data: daftarPengajuan } = await supabase
    .from("kuota_harian")
    .select(`*, profiles:sekolah_id (nama)`)
    .order("created_at", { ascending: false })

  // 3. AMBIL DAFTAR DAPUR UNTUK DROPDOWN PILIHAN
  const { data: daftarDapur } = await supabase
    .from("profiles")
    .select("id, nama")
    .eq("role", "dapur")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Persetujuan Kuota Sekolah
        </h1>
        <p className="text-muted-foreground">
          Tinjau pengajuan dan alokasikan ke Dapur Umum.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama Sekolah</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="min-w-75 text-right">
                Aksi Persetujuan
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {daftarPengajuan?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {new Date(item.tanggal).toLocaleDateString("id-ID", {
                    dateStyle: "medium",
                  })}
                </TableCell>
                <TableCell>
                  {item.profiles?.nama || "Instansi Tidak Ditemukan"}
                </TableCell>
                <TableCell className="font-bold text-blue-600">
                  {item.jumlah_porsi} Porsi
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status_approval === "disetujui"
                        ? "default"
                        : item.status_approval === "ditolak"
                          ? "destructive"
                          : "secondary"
                    }
                    className="flex w-fit items-center gap-1 capitalize"
                  >
                    {item.status_approval === "menunggu" && (
                      <Clock className="size-3" />
                    )}
                    {item.status_approval === "disetujui" && (
                      <CheckCircle2 className="size-3" />
                    )}
                    {item.status_approval === "ditolak" && (
                      <XCircle className="size-3" />
                    )}
                    {item.status_approval}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {item.status_approval === "menunggu" ? (
                    <div className="flex items-center justify-end gap-2">
                      {/* Tombol Tolak */}
                      <form action={ubahStatusKuota}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="status" value="ditolak" />
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          Tolak
                        </Button>
                      </form>

                      {/* Tombol Setujui beserta Pilihan Dapur */}
                      <form
                        action={ubahStatusKuota}
                        className="ml-1 flex items-center gap-2 border-l pl-2"
                      >
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="status" value="disetujui" />
                        <select
                          name="dapur_id"
                          required
                          className="max-w-37.5 rounded-md border bg-black px-2 py-1.5 text-sm text-white"
                        >
                          <option value="">-- Pilih Dapur --</option>
                          {daftarDapur?.map((dapur) => (
                            <option key={dapur.id} value={dapur.id}>
                              {dapur.nama}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="submit"
                          size="sm"
                          className="bg-primary text-white hover:bg-primary/90"
                        >
                          Setujui & Tugaskan
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      Sudah diproses
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {daftarPengajuan?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-primary"
                >
                  Belum ada pengajuan kuota masuk.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
