import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Ambil Auth User
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 2. Ambil Profil User (Nama dan Role)
  const { data: profile } = await supabase
    .from("profiles")
    .select("nama, role")
    .eq("id", user.id)
    .single()

  // 3. Susun objek user untuk Sidebar
  const userData = {
    name: profile?.nama || "Unknown",
    email: user.email || "",
    role: profile?.role || "guest",
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        {/* OPER DATA KE APP SIDEBAR */}
        <AppSidebar user={userData} />

        <main className="w-full">
          <div className="sticky top-0 z-10 flex items-center border-b p-4 backdrop-blur-sm">
            <SidebarTrigger />
            <h1 className="ml-4 text-sm font-semibold">DistriMBG Dashboard</h1>
          </div>

          <div className="p-4">{children}</div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
