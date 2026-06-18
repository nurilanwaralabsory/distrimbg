<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Sekolah;
use App\Models\DapurUmum;
use App\Models\Kurir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class RegisterController extends Controller
{
  // Menampilkan halaman form registrasi
  public function create()
  {
    return view('content.authentication.auth-register-basic');
  }

  // Memproses data form registrasi
  public function store(Request $request)
  {
    // 1. Validasi Input Dasar & Role
    $request->validate([
      'name'     => 'required|string|max:255',
      'email'    => 'required|string|email|max:255|unique:users',
      'password' => 'required|string|min:8', // Hilangkan confirmed karena di form tidak ada password_confirmation
      'role'     => 'required|in:sekolah,dapur,kurir',
    ]);

    // 2. Validasi Dinamis berdasarkan Role
    if ($request->role === 'sekolah') {
      $request->validate([
        'nama_sekolah'   => 'required|string|max:255',
        'kontak_sekolah' => 'required|string|max:20',
        'alamat_sekolah' => 'required|string',
      ]);
    } elseif ($request->role === 'dapur') {
      $request->validate([
        'nama_dapur'       => 'required|string|max:255',
        'kapasitas_harian' => 'required|numeric|min:1',
        'alamat_dapur'     => 'required|string',
      ]);
    } elseif ($request->role === 'kurir') {
      $request->validate([
        'no_kendaraan' => 'required|string|max:15',
      ]);
    }

    // 3. Proses Insert menggunakan DB Transaction
    DB::beginTransaction();
    try {
      // Buat akun Users dengan is_verified = false (menunggu persetujuan admin)
      $user = User::create([
        'name'        => $request->name,
        'email'       => $request->email,
        'password'    => Hash::make($request->password),
        'role'        => $request->role,
        'is_verified' => false,
      ]);

      // Insert ke tabel relasi sesuai role
      if ($request->role === 'sekolah') {
        Sekolah::create([
          'user_id'      => $user->id,
          'nama_sekolah' => $request->nama_sekolah,
          'kontak'       => $request->kontak_sekolah,
          'alamat'       => $request->alamat_sekolah,
        ]);
      } elseif ($request->role === 'dapur') {
        DapurUmum::create([
          'user_id'          => $user->id,
          'nama_dapur'       => $request->nama_dapur,
          'kapasitas_harian' => $request->kapasitas_harian,
          'alamat'           => $request->alamat_dapur,
        ]);
      } elseif ($request->role === 'kurir') {
        Kurir::create([
          'user_id'      => $user->id,
          'nama_kurir'   => $user->name, // Ambil dari input nama PIC
          'no_kendaraan' => strtoupper($request->no_kendaraan),
          'status_aktif' => true,
        ]);
      }

      DB::commit();

      // Redirect ke halaman login dengan notifikasi sukses
      return redirect()->route('login')->with('success', 'Registrasi berhasil. Silahkan tunggu verifikasi dari Admin Dinas sebelum dapat login.');
    } catch (\Exception $e) {
      DB::rollback();
      return back()->withInput()->withErrors(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()]);
    }
  }
}
