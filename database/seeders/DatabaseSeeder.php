<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sekolah;
use App\Models\DapurUmum;
use App\Models\Kurir;
use App\Models\KuotaHarian;
use App\Models\Pesanan;
use App\Models\Pengiriman;
use App\Models\Keluhan;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    User::factory(10)->create();

    // 2. Buat Data Master (5 Sekolah, 2 Dapur Umum, 5 Kurir)
    $sekolahs = Sekolah::factory(5)->create();
    $dapurUmums = DapurUmum::factory(2)->create();
    $kurirs = Kurir::factory(5)->create();

    // 3. Generate Transaksi Logistik Terhubung
    foreach ($sekolahs as $sekolah) {
      // Setiap sekolah mengajukan 3 kuota harian
      $kuotas = KuotaHarian::factory(3)->create([
        'sekolah_id' => $sekolah->id,
        'status_approval' => 'disetujui' // Pastikan disetujui agar bisa diproses dapur
      ]);

      foreach ($kuotas as $kuota) {
        // Setiap kuota yang disetujui diproses oleh dapur secara acak
        $pesanan = Pesanan::factory()->create([
          'kuota_id' => $kuota->id,
          'dapur_id' => $dapurUmums->random()->id,
          'status_produksi' => 'siap_kirim',
          'qr_hash' => \Illuminate\Support\Str::random(32),
        ]);

        // Setiap pesanan dikirim oleh kurir secara acak
        Pengiriman::factory()->create([
          'pesanan_id' => $pesanan->id,
          'kurir_id' => $kurirs->random()->id,
        ]);

        // Simulasi acak: 20% kemungkinan sekolah membuat keluhan
        if (rand(1, 100) <= 20) {
          Keluhan::factory()->create([
            'sekolah_id' => $sekolah->id,
            'pesanan_id' => $pesanan->id,
          ]);
        }
      }
    }
  }
}
