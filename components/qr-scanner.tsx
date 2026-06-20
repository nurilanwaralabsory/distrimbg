"use client"

import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScanLine, Loader2 } from "lucide-react"

// Kita menerima Server Action sebagai props untuk dijalankan saat sukses
export function QrScanner({
  pesananIdTarget,
  pengirimanId,
  onScanSuccessAction,
}: {
  pesananIdTarget: string
  pengirimanId: string
  onScanSuccessAction: (formData: FormData) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    // Hanya inisialisasi scanner jika dialog terbuka
    if (!isOpen) return

    // Konfigurasi scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )

    // Fungsi jika berhasil memindai QR Code
    const onScanSuccess = (decodedText: string) => {
      // Hentikan scanner segera agar tidak scan berkali-kali
      scanner.clear()
      setIsProcessing(true)

      // Validasi: Apakah QR Code yang di-scan milik dapur yang benar?
      if (decodedText === pesananIdTarget) {
        // Buat objek FormData virtual untuk memanggil Server Action
        const formData = new FormData()
        formData.append("id", pengirimanId)
        formData.append("status_pengiriman", "diambil")

        onScanSuccessAction(formData) // Jalankan aksi update ke database
        setIsOpen(false) // Tutup modal
      } else {
        setErrorMsg("QR Code tidak cocok dengan pesanan ini!")
        setIsProcessing(false)
      }
    }

    scanner.render(onScanSuccess, (err) => {
      /* Abaikan error scan frame kosong */
    })

    // Bersihkan memori saat modal ditutup
    return () => {
      scanner.clear().catch((e) => console.error(e))
    }
  }, [isOpen, pesananIdTarget, pengirimanId, onScanSuccessAction])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
          <ScanLine className="mr-2 size-4" /> Scan QR Pengambilan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Layar Dapur</DialogTitle>
          <DialogDescription>
            Arahkan kamera ke QR Code di layar petugas Dapur.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-[300px] flex-col items-center justify-center">
          {isProcessing ? (
            <div className="flex flex-col items-center text-blue-600">
              <Loader2 className="mb-4 size-10 animate-spin" />
              <p className="font-semibold">Memverifikasi Data...</p>
            </div>
          ) : (
            <div
              id="reader"
              className="w-full max-w-[300px] overflow-hidden rounded-lg border-2 border-dashed border-gray-300"
            ></div>
          )}

          {errorMsg && (
            <p className="mt-4 text-sm font-medium text-red-500">{errorMsg}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
