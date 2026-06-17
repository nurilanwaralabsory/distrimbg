<?php

namespace Database\Factories;

use App\Models\DapurUmum;
use App\Models\KuotaHarian;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pesanan>
 */
class PesananFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    $status = $this->faker->randomElement(['dimasak', 'dikemas', 'siap_kirim']);
    return [
      'dapur_id' => DapurUmum::factory(),
      'kuota_id' => KuotaHarian::factory(),
      'status_produksi' => $status,
      'qr_hash' => $status === 'siap_kirim' ? Str::random(32) : null,
    ];
  }
}
