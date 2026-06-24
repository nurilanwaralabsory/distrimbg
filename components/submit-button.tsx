"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// 1. Buat tipe data untuk menerima teks kustom dari luar
interface SubmitButtonProps {
  text: string
  loadingText?: string // Opsional, jika tidak diisi akan memakai default
}

export function SubmitButton({
  text,
  loadingText = "Memproses...",
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="mt-4 w-full text-white" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        text
      )}
    </Button>
  )
}
