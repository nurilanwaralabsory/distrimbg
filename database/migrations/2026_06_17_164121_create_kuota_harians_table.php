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
    Schema::create('kuota_harians', function (Blueprint $table) {
      $table->id();
      $table->foreignId('sekolah_id')->constrained('sekolahs')->cascadeOnDelete();
      $table->date('tanggal');
      $table->integer('jumlah_porsi');
      $table->enum('status_approval', ['pending', 'disetujui', 'ditolak'])->default('pending');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('kuota_harians');
  }
};
