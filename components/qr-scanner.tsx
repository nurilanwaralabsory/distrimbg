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

export function QrScanner({
  pesananIdTarget,
  pengirimanId,
  onScanSuccessAction,
}: {
  pesananIdTarget: string
  pengirimanId: string
  // 1. UBAH BARIS INI: Beri tahu TypeScript bahwa fungsi ini me-return Promise
  onScanSuccessAction: (
    formData: FormData
  ) => Promise<{ error?: string; success?: boolean } | undefined>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // 1. BUAT ID UNIK untuk setiap scanner menggunakan ID Pengiriman
  const scannerId = `reader-${pengirimanId}`

  useEffect(() => {
    if (!isOpen) return

    let scanner: Html5QrcodeScanner | null = null

    // 2. BERI JEDA WAKTU (100ms) agar Dialog selesai merender animasi & DOM-nya
    const timer = setTimeout(() => {
      // Cek apakah elemennya benar-benar sudah ada di layar
      const element = document.getElementById(scannerId)
      if (!element) return

      // Inisialisasi scanner dengan ID yang unik
      scanner = new Html5QrcodeScanner(
        scannerId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      )

      const onScanSuccess = async (decodedText: string) => {
        // <-- Tambahkan async di sini
        scanner?.clear()
        setIsProcessing(true)

        if (decodedText === pesananIdTarget) {
          const formData = new FormData()
          formData.append("id", pengirimanId)
          formData.append("status_pengiriman", "diambil")

          // TAMBAHKAN BARIS INI BOS: Kirim pesanan_id ke server
          formData.append("pesanan_id", pesananIdTarget)

          const result = await onScanSuccessAction(formData)

          if (result?.error) {
            // Jika ditolak oleh Supabase, tampilkan error di layar HP Kurir
            setErrorMsg(result.error)
            setIsProcessing(false)
          } else {
            // Jika benar-benar sukses, baru tutup modalnya
            setIsOpen(false)
          }
        } else {
          setErrorMsg("QR Code tidak cocok dengan pesanan ini!")
          setIsProcessing(false)
        }
      }

      scanner.render(onScanSuccess, (err) => {
        /* Abaikan error frame kosong */
      })
    }, 100) // Delay 100 milidetik

    // Bersihkan memori dan timer saat modal ditutup
    return () => {
      clearTimeout(timer)
      if (scanner) {
        scanner.clear().catch((e) => console.error(e))
      }
    }
  }, [isOpen, pesananIdTarget, pengirimanId, onScanSuccessAction, scannerId])

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
              id={scannerId} // 3. GUNAKAN ID UNIK DI SINI
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
