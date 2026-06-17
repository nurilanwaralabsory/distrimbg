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
    Schema::create('pesanans', function (Blueprint $table) {
      $table->id();
      $table->foreignId('dapur_id')->constrained('dapur_umums')->cascadeOnDelete();
      $table->foreignId('kuota_id')->constrained('kuota_harians')->cascadeOnDelete();
      $table->enum('status_produksi', ['dimasak', 'dikemas', 'siap_kirim'])->default('dimasak');
      $table->string('qr_hash')->unique()->nullable(); // Berisi token/hash untuk di-generate jadi QR Code
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('pesanans');
  }
};
