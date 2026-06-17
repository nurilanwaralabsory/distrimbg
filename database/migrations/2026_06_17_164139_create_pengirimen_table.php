<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('pengirimen', function (Blueprint $table) {
      $table->id();
      $table->foreignId('pesanan_id')->constrained('pesanans')->cascadeOnDelete();
      $table->foreignId('kurir_id')->constrained('kurirs')->cascadeOnDelete();
      $table->timestamp('waktu_berangkat')->nullable();
      $table->timestamp('waktu_sampai')->nullable();
      $table->enum('status', ['menunggu', 'dalam_perjalanan', 'gagal_kirim', 'terkirim'])->default('menunggu');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('pengirimen');
  }
};
