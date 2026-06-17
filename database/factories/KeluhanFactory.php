<?php

namespace Database\Factories;

use App\Models\Pesanan;
use App\Models\Sekolah;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Keluhan>
 */
class KeluhanFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'sekolah_id' => Sekolah::factory(),
      'pesanan_id' => Pesanan::factory(),
      'kategori' => $this->faker->randomElement(['keterlambatan', 'kualitas_makanan', 'porsi_kurang']),
      'deskripsi' => $this->faker->sentence(10),
      'status' => $this->faker->randomElement(['open', 'in_progress', 'resolved']),
    ];
  }
}
