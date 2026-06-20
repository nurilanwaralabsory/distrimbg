import { signup } from "@/app/auth/actions"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Link from "next/link"
import { SubmitButton } from "@/components/submit-button"

export default async function RegisterPage(props: {
  searchParams: Promise<{ message?: string }>
}) {
  // Buka Promise searchParams menggunakan await

  const searchParams = await props.searchParams

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Daftar Kemitraan</CardTitle>

          <CardDescription>
            Bergabunglah dengan ekosistem Makan Bergizi Gratis.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={signup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Instansi / Pengguna</Label>

              <Input
                id="nama"
                name="nama"
                type="text"
                placeholder="Misal: SDN 01 Depok"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Pilih Peran Anda</Label>

              <select
                id="role"
                name="role"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled defaultValue="">
                  Pilih salah satu...
                </option>

                <option value="sekolah">Perwakilan Sekolah</option>

                <option value="dapur">Dapur Umum (Vendor)</option>

                <option value="kurir">Kurir Logistik</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Valid</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input id="password" name="password" type="password" required />
            </div>

            {/* Tampilkan pesan error/sukses jika ada */}

            {searchParams?.message && (
              <p className="mt-4 text-center text-sm text-red-500">
                {searchParams.message}
              </p>
            )}

            <SubmitButton
              text="Daftar Sekarang"
              loadingText="Mendaftarkan Akun..."
            />
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Masuk
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
