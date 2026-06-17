<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sekolah>
 */
class SekolahFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'user_id' => User::factory()->create(['role' => 'sekolah'])->id,
      'nama_sekolah' => 'SDN ' . $this->faker->unique()->city() . ' ' . $this->faker->numberBetween(1, 10),
      'alamat' => $this->faker->address(),
      'koordinat' => $this->faker->latitude() . ',' . $this->faker->longitude(),
      'kontak' => $this->faker->phoneNumber(),
    ];
  }
}
