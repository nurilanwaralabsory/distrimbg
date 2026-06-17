<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DapurUmum>
 */
class DapurUmumFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'user_id' => User::factory()->create(['role' => 'dapur'])->id,
      'nama_dapur' => 'Dapur MBG ' . $this->faker->company(),
      'alamat' => $this->faker->address(),
      'kapasitas_harian' => $this->faker->numberBetween(500, 2000),
    ];
  }
}
