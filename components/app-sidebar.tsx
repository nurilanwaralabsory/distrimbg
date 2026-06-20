"use client"

import * as React from "react"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  LayoutDashboard,
  Users,
  Utensils,
  ChefHat,
  Truck,
  Headset,
  Package,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { logout } from "@/app/auth/actions"

// 1. TENTUKAN TIPE DATA PROPS UNTUK USER
interface UserProfile {
  name: string
  email: string
  role: string
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserProfile
}

// 2. DATA MENU DINAMIS DENGAN ARRAY 'roles'
const navMain = [
  {
    title: "Dashboard Utama",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    roles: ["admin", "sekolah", "dapur", "kurir"], // Semua bisa lihat
  },
  {
    title: "Manajemen Kemitraan",
    url: "/dashboard/kemitraan",
    icon: Users,
    roles: ["admin"], // Hanya admin
  },
  {
    title: "Kuota & Distribusi",
    url: "#",
    icon: Utensils,
    roles: ["admin", "sekolah"],
    items: [
      {
        title: "Pengajuan Kuota",
        url: "/dashboard/kuota/pengajuan",
        roles: ["sekolah", "admin"],
      },
      {
        title: "Persetujuan Kuota",
        url: "/dashboard/kuota/approval",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Dapur Produksi",
    url: "#",
    icon: ChefHat,
    roles: ["admin", "dapur"],
    items: [
      {
        title: "Daftar Pesanan",
        url: "/dashboard/produksi/pesanan",
        roles: ["dapur", "admin"],
      },
      {
        title: "Progress Memasak",
        url: "/dashboard/produksi/progress",
        roles: ["dapur"],
      },
    ],
  },
  {
    title: "Logistik & Armada",
    url: "#",
    icon: Truck,
    roles: ["admin", "kurir", "sekolah"],
    items: [
      {
        title: "Pelacakan Armada",
        url: "/dashboard/logistik/tracking",
        roles: ["admin"],
      },
      {
        title: "Rute Pengantaran",
        url: "/dashboard/logistik/rute",
        roles: ["kurir"],
      },
      {
        title: "Riwayat Pengantaran",
        url: "/dashboard/logistik/riwayat-kurir",
        roles: ["kurir", "admin"],
      },
      {
        title: "Riwayat Penerimaan",
        url: "/dashboard/logistik/penerimaan",
        roles: ["sekolah"],
      },
    ],
  },
  {
    title: "Layanan Keluhan",
    url: "#",
    icon: Headset,
    roles: ["admin", "sekolah"],
    items: [
      {
        title: "Pusat Keluhan",
        url: "/dashboard/keluhan/pusat",
        roles: ["admin"],
      },
      {
        title: "Buat Laporan",
        url: "/dashboard/keluhan/baru",
        roles: ["sekolah"],
      },
    ],
  },
]

// 3. TERIMA PROPS 'user' DI KOMPONEN
export function AppSidebar({ user, ...props }: AppSidebarProps) {
  // LOGIKA FILTER: Saring menu parent dan sub-menu berdasarkan role
  const filteredNav = navMain
    .filter((item) => item.roles.includes(user.role))
    .map((item) => {
      // Jika punya sub-menu, filter juga sub-menunya
      if (item.items) {
        return {
          ...item,
          items: item.items.filter((sub) => sub.roles.includes(user.role)),
        }
      }
      return item
    })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-white">
                {/* Logo DistriMBG */}
                <Package className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-lg font-bold">DistriMBG</span>
                <span className="truncate text-xs text-muted-foreground">
                  Logistik Terpadu
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarMenu>
            {/* RENDER MENU YANG SUDAH DIFILTER */}
            {filteredNav.map((item) =>
              item.items ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronsUpDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                // Render menu tunggal (tanpa dropdown) seperti Dashboard/Kemitraan
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs capitalize">
                      {user.role}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action={logout} className="w-full cursor-pointer">
                    <button
                      type="submit"
                      className="flex w-full items-center text-red-600"
                    >
                      <LogOut className="mr-2 size-4" />
                      Keluar
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
