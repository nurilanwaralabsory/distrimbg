"use client"

import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QrCode } from "lucide-react"

export function QrGenerator({ pesananId }: { pesananId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-green-500 text-green-700 hover:bg-green-50"
        >
          <QrCode className="mr-2 size-4" /> Tampilkan QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center py-10 sm:max-w-md">
        <DialogHeader className="mb-4 w-full text-center">
          <DialogTitle className="text-center">QR Code Penjemputan</DialogTitle>
          <DialogDescription className="text-center">
            Perlihatkan layar ini kepada Kurir untuk di-scan.
          </DialogDescription>
        </DialogHeader>

        {/* Gambar QR Code yang berisi ID Pesanan */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <QRCodeSVG value={pesananId} size={200} level="H" />
        </div>

        <p className="mt-4 px-6 text-center font-mono text-xs break-all text-gray-400">
          ID: {pesananId}
        </p>
      </DialogContent>
    </Dialog>
  )
}
