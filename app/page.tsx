"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function DistriMBGLandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const router = useRouter()
  const handleKlik = () => {
    router.push("/login")
  }

  return (
    <>
      {/* Import Font & Icons langsung di dalam komponen */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        rel="stylesheet"
      />

      {/* Custom CSS disisipkan langsung agar tidak perlu sentuh globals.css */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .material-symbols-outlined.fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Geist', sans-serif; }

        .mesh-bg {
          background-color: #f8f9fa;
          background-image: 
            radial-gradient(at 0% 0%, rgba(218, 226, 255, 0.4) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(111, 251, 133, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(0, 82, 204, 0.08) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(214, 227, 255, 0.4) 0px, transparent 50%);
          background-attachment: fixed;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 8px 32px 0 rgba(0, 33, 71, 0.05);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          box-shadow: 0 12px 32px rgba(0, 52, 204, 0.08);
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.7);
        }

        .glass-card-dark {
          background: rgba(0, 82, 204, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 12px 40px rgba(0, 61, 155, 0.3);
        }

        .gradient-text {
          background: linear-gradient(135deg, #003d9b, #006e28);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-gradient {
          background: linear-gradient(135deg, #003d9b, #0052cc);
          transition: all 0.3s ease;
        }
        .btn-gradient:hover {
          background: linear-gradient(135deg, #0052cc, #0c56d0);
          box-shadow: 0 8px 24px rgba(0, 82, 204, 0.3);
        }

        .icon-gradient { background: linear-gradient(135deg, rgba(0, 82, 204, 0.1), rgba(0, 110, 40, 0.1)); }
        
        .glow-effect {
          position: absolute;
          inset: -20px;
          background: linear-gradient(135deg, rgba(0, 82, 204, 0.3), rgba(111, 251, 133, 0.2));
          filter: blur(40px);
          z-index: -1;
          border-radius: inherit;
        }
      `,
        }}
      />

      <div className="mesh-bg flex min-h-screen flex-col bg-[#f8f9fa] pt-[80px] text-[#191c1d]">
        {/* TopNavBar Component */}
        <div className="pointer-events-none fixed top-0 left-0 z-50 mt-2 w-full px-4 py-2 md:px-10">
          <nav className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/60 bg-white/70 px-6 py-2 shadow-sm backdrop-blur-md">
            <div className="flex items-center">
              <span className="gradient-text text-[24px] leading-[32px] font-bold">
                DistriMBG
              </span>
            </div>
            <div className="hidden gap-6 md:flex">
              <a
                className="border-b-2 border-[#003d9b] pb-1 text-[14px] leading-[16px] font-bold tracking-[0.05em] text-[#003d9b] transition-all"
                href="#"
              >
                Tentang
              </a>
              <a
                className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#434654] transition-all hover:text-[#003d9b]"
                href="#fitur"
              >
                Fitur
              </a>
              <a
                className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#434654] transition-all hover:text-[#003d9b]"
                href="#alur"
              >
                Alur
              </a>
              <a
                className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#434654] transition-all hover:text-[#003d9b]"
                href="#kontak"
              >
                Kontak
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleKlik}
                className="btn-gradient flex items-center gap-1 rounded-full px-6 py-2 text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#ffffff] shadow-lg shadow-[#003d9b]/20 transition-all hover:opacity-90"
              >
                Masuk / Login
              </Button>

              <button
                onClick={toggleMobileMenu}
                className="rounded-full border border-white/50 bg-white/50 p-2 text-[#191c1d] backdrop-blur-sm transition-colors hover:bg-[#e1e3e4] md:hidden"
              >
                <span className="material-symbols-outlined">
                  {isMobileMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } glass-panel fixed inset-0 z-40 flex-col gap-6 px-10 pt-[100px]`}
        >
          <div className="glass-card flex flex-col gap-4 rounded-2xl p-6">
            <a
              onClick={toggleMobileMenu}
              className="block border-b border-[#003d9b]/20 pb-4 text-[14px] leading-[16px] font-bold tracking-[0.05em] text-[#003d9b]"
              href="#"
            >
              Tentang
            </a>
            <a
              onClick={toggleMobileMenu}
              className="block border-b border-[#737685]/20 pb-4 text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#434654]"
              href="#fitur"
            >
              Fitur
            </a>
            <a
              onClick={toggleMobileMenu}
              className="block border-b border-[#737685]/20 pb-4 text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#434654]"
              href="#alur"
            >
              Alur
            </a>
            <a
              onClick={toggleMobileMenu}
              className="block pb-4 text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#434654]"
              href="#kontak"
            >
              Kontak
            </a>
          </div>
        </div>

        {/* Main Content Canvas */}
        <main className="flex flex-grow flex-col pt-6">
          {/* Hero Section */}
          <section className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-[64px] px-4 py-[64px] md:px-10 md:py-[80px] lg:flex-row">
            <div className="z-10 flex w-full flex-col gap-6 lg:w-1/2">
              <div className="glass-card mb-4 inline-flex w-max items-center gap-2 rounded-full px-4 py-1 text-[#191c1d]">
                <span className="h-2 w-2 rounded-full bg-[#006e28]"></span>
                <span className="text-[12px] leading-[14px] font-medium">
                  Program Nasional Berjalan
                </span>
              </div>
              <h1 className="text-[30px] leading-[36px] font-bold tracking-[-0.02em] text-[#191c1d] md:text-[40px] md:leading-[48px]">
                Distribusi Tepat Sasaran, <br />
                <span className="gradient-text">
                  Generasi Sehat Masa Depan.
                </span>
              </h1>
              <p className="max-w-2xl text-[18px] leading-[28px] text-[#434654]">
                Platform logistik terpusat yang menghubungkan sekolah, dapur
                umum, dan kurir untuk memastikan program Makan Bergizi Gratis
                sampai ke tangan yang tepat secara real-time.
              </p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <button className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-10 py-4 text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#ffffff] shadow-xl shadow-[#003d9b]/20 transition-all hover:opacity-90 sm:w-auto">
                  Masuk / Login
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>
                <button className="glass-card w-full rounded-xl px-10 py-4 text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#191c1d] transition-all hover:bg-white/80 sm:w-auto">
                  Pelajari Sistem
                </button>
              </div>
              <div className="mt-6 flex items-center gap-4 pt-6">
                <div className="flex -space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#0052cc] text-[12px] leading-[14px] font-medium text-[#c4d2ff] shadow-sm">
                    5k+
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#6ffb85] text-[12px] leading-[14px] font-medium text-[#00732a] shadow-sm">
                    1k+
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#425b84] text-[12px] leading-[14px] font-medium text-[#bcd3ff] shadow-sm">
                    10k+
                  </div>
                </div>
                <span className="text-[14px] leading-[20px] font-medium text-[#434654]">
                  Sekolah, Dapur & Kurir Terdaftar
                </span>
              </div>
            </div>
            <div className="relative min-h-[400px] w-full lg:min-h-[500px] lg:w-1/2">
              <div className="glow-effect"></div>
              <div className="glass-card relative h-full w-full overflow-hidden rounded-2xl p-2">
                <img
                  className="h-full w-full rounded-xl object-cover"
                  alt="DistriMBG Dashboard Mockup"
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
                />
                {/* Floating UI Element Mockup */}
                <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between rounded-xl bg-white/70 p-4">
                  <div className="flex items-center gap-4">
                    <div className="icon-gradient flex h-12 w-12 items-center justify-center rounded-full border border-[#006e28]/20 text-[#006e28]">
                      <span className="material-symbols-outlined fill text-[24px]">
                        local_shipping
                      </span>
                    </div>
                    <div>
                      <p className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#191c1d]">
                        SDN 01 Merdeka
                      </p>
                      <p className="text-[14px] leading-[20px] text-[#434654]">
                        Status: Dalam Perjalanan (2km)
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-[#006e28]/30 bg-[#006e28]/20 px-2 py-1 text-[12px] leading-[14px] font-medium text-[#006e28] shadow-sm backdrop-blur-sm">
                    On Track
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Problem vs Solution Section */}
          <section className="relative py-[64px] md:py-[100px]">
            <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#003d9b]/5 blur-3xl"></div>
            <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-10">
              <div className="mb-[40px] text-center md:mb-[64px]">
                <h2 className="mb-4 text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-[#191c1d]">
                  Mengatasi Kendala Logistik Skala Besar
                </h2>
                <p className="mx-auto max-w-2xl text-[18px] leading-[28px] text-[#434654]">
                  Transformasi dari proses manual ke sistem digital yang
                  terintegrasi penuh.
                </p>
              </div>
              <div className="flex flex-col items-center gap-6 md:flex-row md:gap-[64px]">
                {/* Problems */}
                <div className="flex w-full flex-col gap-4 md:w-5/12">
                  <div className="glass-card flex items-start gap-4 rounded-2xl border-l-4 border-l-[#ba1a1a] p-6">
                    <div className="mt-1 rounded-full bg-[#ba1a1a]/10 p-2 text-[#ba1a1a]">
                      <span className="material-symbols-outlined">warning</span>
                    </div>
                    <div>
                      <h4 className="mb-1 text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#191c1d]">
                        Food Waste Tinggi
                      </h4>
                      <p className="text-[14px] leading-[20px] text-[#434654]">
                        Ketidaksesuaian data harian siswa yang hadir menyebabkan
                        produksi berlebih dan pemborosan.
                      </p>
                    </div>
                  </div>
                  <div className="glass-card flex items-start gap-4 rounded-2xl border-l-4 border-l-[#737685] p-6">
                    <div className="mt-1 rounded-full bg-[#737685]/10 p-2 text-[#737685]">
                      <span className="material-symbols-outlined">
                        sync_problem
                      </span>
                    </div>
                    <div>
                      <h4 className="mb-1 text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#191c1d]">
                        Data Tidak Sinkron
                      </h4>
                      <p className="text-[14px] leading-[20px] text-[#434654]">
                        Laporan manual yang lambat antara sekolah dan dapur umum
                        menyebabkan inefisiensi produksi.
                      </p>
                    </div>
                  </div>
                  <div className="glass-card flex items-start gap-4 rounded-2xl border-l-4 border-l-[#737685] p-6">
                    <div className="mt-1 rounded-full bg-[#737685]/10 p-2 text-[#737685]">
                      <span className="material-symbols-outlined">
                        visibility_off
                      </span>
                    </div>
                    <div>
                      <h4 className="mb-1 text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#191c1d]">
                        Hilangnya Visibilitas
                      </h4>
                      <p className="text-[14px] leading-[20px] text-[#434654]">
                        Pusat kesulitan melacak pergerakan kurir dan memastikan
                        distribusi tepat waktu dan aman.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden w-2/12 items-center justify-center md:flex">
                  <div className="relative flex h-full w-px items-center justify-center bg-gradient-to-b from-transparent via-[#003d9b]/50 to-transparent">
                    <div className="glass-panel absolute flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
                      <span className="material-symbols-outlined text-[#003d9b]">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center py-4 md:hidden">
                  <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-full shadow-lg">
                    <span className="material-symbols-outlined text-[24px] text-[#003d9b]">
                      arrow_downward
                    </span>
                  </div>
                </div>

                {/* Solution */}
                <div className="glass-card-dark relative w-full overflow-hidden rounded-2xl p-[40px] text-white md:w-5/12">
                  <div className="absolute -top-20 -right-20 h-[200px] w-[200px] rounded-full bg-white/10 blur-2xl"></div>
                  <div className="absolute -bottom-20 -left-20 h-[200px] w-[200px] rounded-full bg-[#006e28]/20 blur-2xl"></div>
                  <div className="relative z-10 flex h-full flex-col justify-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/20 shadow-lg backdrop-blur-md">
                      <span className="material-symbols-outlined text-[32px] text-white">
                        hub
                      </span>
                    </div>
                    <h3 className="mb-4 text-[24px] leading-[32px] font-bold text-white">
                      Sistem Digital Terpusat DistriMBG
                    </h3>
                    <p className="mb-6 text-[16px] leading-[24px] text-blue-100">
                      Satu platform untuk semua pemangku kepentingan.
                      Sinkronisasi real-time, validasi digital, dan pelacakan
                      GPS untuk menjamin integritas program.
                    </p>
                    <ul className="flex flex-col gap-4">
                      <li className="glass-panel flex items-center gap-2 rounded-lg !border-white/10 !bg-white/5 p-2 text-[14px] leading-[16px] font-semibold tracking-[0.05em]">
                        <span className="material-symbols-outlined text-[20px] text-[#53e16f]">
                          check_circle
                        </span>
                        Akurasi Porsi Harian
                      </li>
                      <li className="glass-panel flex items-center gap-2 rounded-lg !border-white/10 !bg-white/5 p-2 text-[14px] leading-[16px] font-semibold tracking-[0.05em]">
                        <span className="material-symbols-outlined text-[20px] text-[#53e16f]">
                          check_circle
                        </span>
                        Validasi Serah Terima E-Proof
                      </li>
                      <li className="glass-panel flex items-center gap-2 rounded-lg !border-white/10 !bg-white/5 p-2 text-[14px] leading-[16px] font-semibold tracking-[0.05em]">
                        <span className="material-symbols-outlined text-[20px] text-[#53e16f]">
                          check_circle
                        </span>
                        Monitoring End-to-End
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid Section */}
          <section
            className="relative mx-auto max-w-7xl px-4 py-[64px] md:px-10 md:py-[100px]"
            id="fitur"
          >
            <div className="pointer-events-none absolute top-40 left-0 h-[400px] w-[400px] rounded-full bg-[#006e28]/5 blur-3xl"></div>
            <div className="relative z-10 mb-[40px] flex flex-col justify-between gap-4 md:mb-[64px] md:flex-row md:items-end">
              <div className="max-w-2xl">
                <h2 className="mb-2 border-l-4 border-[#003d9b] pl-4 text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-[#191c1d]">
                  Fitur Unggulan Pengelolaan Logistik
                </h2>
                <p className="text-[18px] leading-[28px] text-[#434654]">
                  Modul spesifik yang dirancang untuk efisiensi di setiap tahap
                  distribusi.
                </p>
              </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="glass-card flex h-full flex-col rounded-2xl border-t-4 border-t-[#003d9b] p-6">
                <div className="icon-gradient mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#003d9b]/20 text-[#003d9b] shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">
                    edit_document
                  </span>
                </div>
                <h3 className="mb-2 text-[18px] leading-[20px] font-semibold tracking-[0.05em] text-[#191c1d]">
                  Pengajuan Kuota Mandiri
                </h3>
                <p className="mt-auto text-[14px] leading-[20px] text-[#434654]">
                  Perwakilan sekolah dapat memperbarui kuota harian dengan mudah
                  berdasarkan kehadiran aktual siswa, meminimalkan pemborosan.
                </p>
              </div>

              {/* Card 2 */}
              <div className="glass-card flex h-full flex-col rounded-2xl border-t-4 border-t-[#006e28] p-6">
                <div className="icon-gradient mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#006e28]/20 text-[#006e28] shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">
                    qr_code_scanner
                  </span>
                </div>
                <h3 className="mb-2 text-[18px] leading-[20px] font-semibold tracking-[0.05em] text-[#191c1d]">
                  Validasi QR Code (E-Proof)
                </h3>
                <p className="mt-auto text-[14px] leading-[20px] text-[#434654]">
                  Serah terima makanan aman dan akurat dengan pemindaian QR
                  unik, tercatat secara real-time ke dalam sistem pusat.
                </p>
              </div>

              {/* Card 3 */}
              <div className="glass-card flex h-full flex-col rounded-2xl border-t-4 border-t-[#29436b] p-6 md:col-span-2 lg:col-span-1">
                <div className="icon-gradient mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#29436b]/20 text-[#29436b] shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">
                    route
                  </span>
                </div>
                <h3 className="mb-2 text-[18px] leading-[20px] font-semibold tracking-[0.05em] text-[#191c1d]">
                  Pelacakan Real-Time
                </h3>
                <p className="mt-auto text-[14px] leading-[20px] text-[#434654]">
                  Pantau rute kurir dan status produksi dari dapur umum secara
                  langsung dengan integrasi GPS pada perangkat kurir.
                </p>
              </div>

              {/* Card 4 */}
              <div className="glass-card col-span-1 flex flex-col items-center gap-6 rounded-2xl border-t-4 border-t-[#0052cc] p-6 md:col-span-2 md:flex-row md:p-[40px] lg:col-span-3">
                <div className="w-full md:w-1/2">
                  <div className="icon-gradient mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#0052cc]/20 text-[#0052cc] shadow-sm">
                    <span className="material-symbols-outlined text-[28px]">
                      analytics
                    </span>
                  </div>
                  <h3 className="mb-2 text-[24px] leading-[32px] font-semibold text-[#191c1d]">
                    Dashboard Analitik
                  </h3>
                  <p className="mb-4 text-[16px] leading-[24px] text-[#434654]">
                    Pemantauan strategis bagi admin pusat dengan sistem
                    peringatan dini untuk kendala logistik, serta pelaporan
                    komprehensif.
                  </p>
                  <a
                    className="group inline-flex items-center gap-1 text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#003d9b] hover:underline"
                    href="#"
                  >
                    Lihat Contoh Dashboard{" "}
                    <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </a>
                </div>
                <div className="flex w-full flex-col gap-2 rounded-xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-md md:w-1/2">
                  <div className="flex items-center justify-between border-b border-[#c3c6d6]/30 pb-2">
                    <span className="text-[12px] leading-[14px] font-medium text-[#191c1d]">
                      Distribusi Hari Ini
                    </span>
                    <span className="rounded-md border border-[#006e28]/30 bg-[#006e28]/20 px-2 py-1 text-[10px] font-bold text-[#006e28] shadow-sm">
                      98% On Time
                    </span>
                  </div>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#e1e3e4] shadow-inner">
                    <div className="btn-gradient relative h-full w-[85%] rounded-full">
                      <div className="absolute inset-0 bg-white/20"></div>
                    </div>
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] font-medium text-[#434654]">
                    <span>Terkirim: 45,000 porsi</span>
                    <span>Target: 50,000 porsi</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Section */}
          <section className="glass-card-dark relative mx-4 my-[40px] overflow-hidden rounded-3xl border-none py-[64px] text-white shadow-2xl md:mx-10 md:py-[120px]">
            <div className="pointer-events-none absolute -top-20 -right-20 h-[600px] w-[600px] rounded-full bg-[#006e28]/20 blur-[80px]"></div>
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-[80px]"></div>
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center md:px-10">
              <span className="mb-4 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-blue-200 uppercase">
                Dampak Nyata
              </span>
              <h2 className="mb-[40px] max-w-3xl text-[32px] leading-[40px] font-semibold tracking-[-0.01em]">
                Meningkatkan Efisiensi dan Menjaga Kualitas Nutrisi
              </h2>
              <div className="grid w-full max-w-4xl grid-cols-1 gap-[40px] md:grid-cols-2">
                <div className="glass-panel flex flex-col items-center justify-center rounded-3xl !border-white/20 !bg-white/10 p-[40px] backdrop-blur-xl transition-all hover:!bg-white/15">
                  <span className="mt-6 mb-4 text-[72px] leading-[48px] font-bold text-[#53e16f] drop-shadow-lg">
                    95%
                  </span>
                  <span className="mb-1 text-[18px] leading-[20px] font-semibold tracking-[0.05em] text-white">
                    Akurasi Data Distribusi
                  </span>
                  <p className="mt-2 max-w-[250px] text-center text-[14px] leading-[20px] text-blue-100">
                    Peningkatan ketepatan sasaran penerima manfaat harian.
                  </p>
                </div>
                <div className="glass-panel flex flex-col items-center justify-center rounded-3xl !border-white/20 !bg-white/10 p-[40px] backdrop-blur-xl transition-all hover:!bg-white/15">
                  <span className="mt-6 mb-4 text-[72px] leading-[48px] font-bold text-[#53e16f] drop-shadow-lg">
                    30%
                  </span>
                  <span className="mb-1 text-[18px] leading-[20px] font-semibold tracking-[0.05em] text-white">
                    Penurunan Food Waste
                  </span>
                  <p className="mt-2 max-w-[250px] text-center text-[14px] leading-[20px] text-blue-100">
                    Pengurangan sisa makanan berkat sinkronisasi kuota dinamis.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="relative py-[64px] md:py-[100px]">
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[#003d9b]/10 blur-[100px]"></div>
            <div className="glass-card relative z-10 mx-auto flex max-w-3xl flex-col items-center rounded-3xl border-2 border-white/60 p-[40px] px-4 text-center">
              <div className="icon-gradient mb-6 flex h-20 w-20 rotate-3 items-center justify-center rounded-2xl border border-[#003d9b]/20 text-[#003d9b] shadow-lg">
                <span className="material-symbols-outlined -rotate-3 text-[40px]">
                  handshake
                </span>
              </div>
              <h2 className="mb-4 text-[32px] leading-[40px] font-bold tracking-[-0.01em] text-[#191c1d]">
                Mari Sukseskan Program Makan Bergizi Gratis
              </h2>
              <p className="mb-[40px] max-w-2xl text-[18px] leading-[28px] text-[#434654]">
                Bergabunglah dalam jaringan ekosistem logistik modern untuk
                generasi yang lebih sehat dan cerdas.
              </p>
              <button className="btn-gradient rounded-xl px-[64px] py-[24px] text-[18px] leading-[20px] font-bold tracking-[0.05em] text-[#ffffff] shadow-xl shadow-[#003d9b]/30 transition-all hover:opacity-90">
                Daftarkan Institusi Anda
              </button>
            </div>
          </section>
        </main>

        {/* Footer Component */}
        <footer className="full-width relative bottom-0 z-10 mx-auto mt-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 border-t border-white/20 bg-[#2e3132] px-[40px] py-[64px] text-[#bcd3ff] md:flex-row dark:bg-[#ffffff] dark:text-[#003d9b]">
          <div className="flex max-w-xs flex-col gap-2">
            <span className="text-[24px] leading-[32px] font-bold text-[#f0f1f2] dark:text-[#003d9b]">
              DistriMBG
            </span>
            <p className="mt-2 text-[14px] leading-[20px] opacity-80">
              Sistem Logistik Terintegrasi untuk Program Nasional Makan Bergizi
              Gratis.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-[40px] gap-y-4">
            <a
              className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#c3c6d6] transition-all hover:text-[#f0f1f2] hover:opacity-80"
              href="#"
            >
              Tentang
            </a>
            <a
              className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#c3c6d6] transition-all hover:text-[#f0f1f2] hover:opacity-80"
              href="#"
            >
              Fitur
            </a>
            <a
              className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#c3c6d6] transition-all hover:text-[#f0f1f2] hover:opacity-80"
              href="#"
            >
              Alur
            </a>
            <a
              className="text-[14px] leading-[16px] font-semibold tracking-[0.05em] text-[#c3c6d6] transition-all hover:text-[#f0f1f2] hover:opacity-80"
              href="#"
            >
              Kontak
            </a>
          </div>
          <div className="mt-6 w-full border-t border-[#c3c6d6]/20 pt-6 text-[14px] leading-[20px] text-[#c3c6d6] md:mt-0 md:w-auto md:border-t-0 md:pt-0">
            © 2026 DistriMBG Program Makan Bergizi Gratis. Seluruh hak cipta
            dilindungi.
          </div>
        </footer>
      </div>
    </>
  )
}
