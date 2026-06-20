"use client"

import { useState } from "react"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  MapPin,
  Box,
  Truck,
  AlertCircle,
  Building2,
  UtensilsCrossed,
} from "lucide-react"

// Tipe data yang akan diterima dari Server
type Profile = {
  id: string
  nama: string
  role: string
  created_at: string
}

export function KemitraanTable({ profiles }: { profiles: Profile[] }) {
  // State untuk mengontrol Sheet dan menyimpan data mitra yang sedang diklik
  const [selectedMitra, setSelectedMitra] = useState<Profile | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleOpenDetail = (mitra: Profile) => {
    setSelectedMitra(mitra)
    setIsSheetOpen(true)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "dapur":
        return "destructive"
      case "sekolah":
        return "secondary"
      case "kurir":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <>
      {/* BAGIAN TABEL UTAMA */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12.5">No</TableHead>
              <TableHead>Nama Instansi / Pengguna</TableHead>
              <TableHead>Peran (Role)</TableHead>
              <TableHead>Tanggal Bergabung</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile, index) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-semibold">{profile.nama}</TableCell>
                <TableCell>
                  <Badge
                    variant={getRoleBadgeVariant(profile.role)}
                    className="capitalize"
                  >
                    {profile.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(profile.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {/* TOMBOL PEMICU SHEET */}
                  <Button
                    variant="link"
                    className="p-0 text-blue-600"
                    onClick={() => handleOpenDetail(profile)}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {profiles?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-6 text-center text-gray-500"
                >
                  Belum ada mitra yang terdaftar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* BAGIAN PANEL SLIDE-OVER (SHEET) DETAIL MITRA */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] overflow-y-auto sm:w-[540px]">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">{selectedMitra?.nama}</SheetTitle>
            <SheetDescription className="font-medium text-primary capitalize">
              Role: {selectedMitra?.role}
            </SheetDescription>
          </SheetHeader>

          {/* KONTEN DETAIL BERDASARKAN ROLE */}
          {selectedMitra && (
            <div className="space-y-6">
              {/* Info Umum */}
              <div className="space-y-3 rounded-lg p-4 shadow-sm">
                <h3 className="mb-3 border-b pb-2 font-semibold text-white">
                  Informasi Sistem
                </h3>
                <div className="text-sm">
                  <p className="mb-1 text-gray-500">ID Pengguna (UUID)</p>
                  <p className="rounded p-1 font-mono text-xs break-all">
                    {selectedMitra.id}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="mb-1 text-gray-500">Bergabung Sejak</p>
                  <p className="font-medium">
                    {new Date(selectedMitra.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* Data Spesifik Simulasi (Nanti akan diisi dari relasi database) */}
              <div className="space-y-4 rounded-lg p-4">
                <h3 className="border-b pb-2 font-semibold text-white">
                  Statistik Operasional
                </h3>

                {selectedMitra.role === "sekolah" && (
                  <>
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="size-5 text-primary" />
                      <div>
                        <p className="text-gray-500">Total Kuota Diterima</p>
                        <p className="text-lg font-semibold">0 Porsi</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <AlertCircle className="size-5 text-primary" />
                      <div>
                        <p className="text-gray-500">Riwayat Keluhan</p>
                        <p className="text-lg font-semibold">0 Laporan</p>
                      </div>
                    </div>
                  </>
                )}

                {selectedMitra.role === "dapur" && (
                  <>
                    <div className="flex items-center gap-3 text-sm">
                      <UtensilsCrossed className="size-5 text-orange-500" />
                      <div>
                        <p className="text-gray-500">Pesanan Diselesaikan</p>
                        <p className="text-lg font-semibold">0 Pesanan</p>
                      </div>
                    </div>
                  </>
                )}

                {selectedMitra.role === "kurir" && (
                  <>
                    <div className="flex items-center gap-3 text-sm">
                      <Truck className="size-5 text-green-500" />
                      <div>
                        <p className="text-gray-500">Rute Diselesaikan</p>
                        <p className="text-lg font-semibold">0 Pengantaran</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="size-5 text-blue-500" />
                      <div>
                        <p className="text-gray-500">Status Saat Ini</p>
                        <p className="font-semibold text-green-600">Standby</p>
                      </div>
                    </div>
                  </>
                )}

                {selectedMitra.role === "admin" && (
                  <p className="text-sm text-gray-500 italic">
                    Administrator memiliki akses penuh ke sistem.
                  </p>
                )}
              </div>

              {/* Tombol Aksi Admin */}
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="outline" className="w-full">
                  Edit Profil Mitra
                </Button>
                {selectedMitra.role !== "admin" && (
                  <Button
                    variant="destructive"
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Nonaktifkan (Suspend) Akun
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
