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
    Schema::create('keluhans', function (Blueprint $table) {
      $table->id();
      $table->foreignId('sekolah_id')->constrained('sekolahs')->cascadeOnDelete();
      $table->foreignId('pesanan_id')->nullable()->constrained('pesanans')->nullOnDelete();
      $table->string('kategori'); // Keterlambatan, Kuantitas, Kualitas, dll.
      $table->text('deskripsi');
      $table->enum('status', ['open', 'in_progress', 'resolved'])->default('open');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('keluhans');
  }
};
