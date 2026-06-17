<?php

namespace Database\Factories;

use App\Models\Kurir;
use App\Models\Pesanan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pengiriman>
 */
class PengirimanFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    $status = $this->faker->randomElement(['menunggu', 'dalam_perjalanan', 'terkirim']);
    $waktuBerangkat = $status != 'menunggu' ? $this->faker->dateTimeThisMonth() : null;
    $waktuSampai = $status == 'terkirim' ? $this->faker->dateTimeInInterval($waktuBerangkat, '+2 hours') : null;
    return [
      'pesanan_id' => Pesanan::factory(),
      'kurir_id' => Kurir::factory(),
      'waktu_berangkat' => $waktuBerangkat,
      'waktu_sampai' => $waktuSampai,
      'status' => $status,
    ];
  }
}
