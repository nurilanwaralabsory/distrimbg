<?php

namespace Database\Factories;

use App\Models\Sekolah;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KuotaHarian>
 */
class KuotaHarianFactory extends Factory
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
      'tanggal' => $this->faker->dateTimeBetween('-1 week', 'now')->format('Y-m-d'),
      'jumlah_porsi' => $this->faker->numberBetween(100, 500),
      'status_approval' => $this->faker->randomElement(['pending', 'disetujui', 'ditolak']),
    ];
  }
}
