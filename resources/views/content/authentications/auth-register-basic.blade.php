@php
  $configData = Helper::appClasses();
  $customizerHidden = 'customizer-hide';
@endphp

@extends('layouts/layoutMaster')

@section('title', 'Pendaftaran Akun DistriMBG')

@section('vendor-style')
  @vite(['resources/assets/vendor/libs/@form-validation/form-validation.scss'])
@endsection

@section('page-style')
  @vite(['resources/assets/vendor/scss/pages/page-auth.scss'])
@endsection

@section('vendor-script')
  @vite(['resources/assets/vendor/libs/@form-validation/popular.js', 'resources/assets/vendor/libs/@form-validation/bootstrap5.js', 'resources/assets/vendor/libs/@form-validation/auto-focus.js'])
@endsection

@section('content')
  <div class="position-relative">
    <div class="authentication-wrapper authentication-basic container-p-y p-4 p-sm-0">
      <div class="authentication-inner py-6">
        <div class="card p-md-7 p-1">
          <div class="app-brand justify-content-center mt-5">
            <a href="{{ url('/') }}" class="app-brand-link gap-2">
              <span class="app-brand-logo demo">@include('_partials.macros')</span>
              <span class="app-brand-text demo text-heading fw-semibold">DistriMBG</span>
            </a>
          </div>

          <div class="card-body mt-1">
            <h4 class="mb-1">Pendaftaran Akun Kemitraan 🚀</h4>
            <p class="mb-5">Silahkan isi data sesuai dengan peran instansi Anda.</p>

            <form id="formAuthentication" class="mb-5" action="{{ route('register.store') }}" method="POST">
              @csrf

              <div class="form-floating form-floating-outline mb-4 form-control-validation">
                <input type="text" class="form-control @error('name') is-invalid @enderror" id="name"
                  name="name" placeholder="Nama Penanggung Jawab (PIC)" value="{{ old('name') }}" required
                  autofocus />
                <label for="name">Nama Penanggung Jawab (PIC)</label>
                @error('name')
                  <div class="invalid-feedback">{{ $message }}</div>
                @enderror
              </div>

              <div class="form-floating form-floating-outline mb-4 form-control-validation">
                <input type="email" class="form-control @error('email') is-invalid @enderror" id="email"
                  name="email" placeholder="email@instansi.com" value="{{ old('email') }}" required />
                <label for="email">Email</label>
                @error('email')
                  <div class="invalid-feedback">{{ $message }}</div>
                @enderror
              </div>

              <div class="mb-4 form-password-toggle form-control-validation">
                <div class="input-group input-group-merge">
                  <div class="form-floating form-floating-outline">
                    <input type="password" id="password" class="form-control @error('password') is-invalid @enderror"
                      name="password"
                      placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" required />
                    <label for="password">Password</label>
                  </div>
                  <span class="input-group-text cursor-pointer"><i
                      class="icon-base ri ri-eye-off-line icon-20px"></i></span>
                </div>
                @error('password')
                  <div class="text-danger small mt-1">{{ $message }}</div>
                @enderror
              </div>

              <div class="mb-4 form-password-toggle form-control-validation">
                <div class="input-group input-group-merge">
                  <div class="form-floating form-floating-outline">
                    <input type="password" id="password_confirmation" class="form-control" name="password_confirmation"
                      placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" required />
                    <label for="password_confirmation">Konfirmasi Password</label>
                  </div>
                  <span class="input-group-text cursor-pointer"><i
                      class="icon-base ri ri-eye-off-line icon-20px"></i></span>
                </div>
                @error('password_confirmation')
                  <div class="text-danger small mt-1">{{ $message }}</div>
                @enderror
              </div>

              <div class="form-floating form-floating-outline mb-4">
                <select class="form-select" id="roleSelect" name="role" required>
                  <option value="" disabled selected>Pilih Peran Anda</option>
                  <option value="sekolah" {{ old('role') == 'sekolah' ? 'selected' : '' }}>Perwakilan Sekolah</option>
                  <option value="dapur" {{ old('role') == 'dapur' ? 'selected' : '' }}>Dapur Umum (Vendor)</option>
                  <option value="kurir" {{ old('role') == 'kurir' ? 'selected' : '' }}>Kurir Logistik</option>
                </select>
                <label for="roleSelect">Mendaftar Sebagai</label>
                @error('role')
                  <div class="text-danger small mt-1">{{ $message }}</div>
                @enderror
              </div>

              <div id="fields-sekolah" class="d-none  rounded mb-4">
                <h6 class="fw-semibold">Detail Sekolah</h6>
                <div class="form-floating form-floating-outline mb-3">
                  <input type="text" class="form-control" name="nama_sekolah" placeholder="Contoh: SDN 01 Depok"
                    value="{{ old('nama_sekolah') }}" />
                  <label>Nama Sekolah</label>
                </div>
                <div class="form-floating form-floating-outline mb-3">
                  <input type="text" class="form-control" name="kontak_sekolah" placeholder="Nomor Telepon Aktif"
                    value="{{ old('kontak_sekolah') }}" />
                  <label>Nomor Kontak Sekolah</label>
                </div>
                <div class="form-floating form-floating-outline">
                  <textarea class="form-control" name="alamat_sekolah" style="height: 80px" id="alamat_sekolah"
                    placeholder="Alamat Lengkap">{{ old('alamat_sekolah') }}</textarea>
                  <label for="alamat_sekolah">Alamat Lengkap</label>
                </div>

              </div>

              <div id="fields-dapur" class="dynamic-field d-none bg-lighter p-3 rounded mb-4">
                <h6 class="fw-semibold">Detail Dapur Umum</h6>
                <div class="form-floating form-floating-outline mb-3">
                  <input type="text" class="form-control" name="nama_dapur" placeholder="Nama Katering / Vendor"
                    value="{{ old('nama_dapur') }}" />
                  <label>Nama Dapur Umum</label>
                </div>
                <div class="form-floating form-floating-outline mb-3">
                  <input type="number" class="form-control" name="kapasitas_harian" placeholder="Kapasitas Porsi"
                    value="{{ old('kapasitas_harian') }}" />
                  <label>Kapasitas Produksi Harian (Porsi)</label>
                </div>
                <div class="form-floating form-floating-outline">
                  <textarea class="form-control" name="alamat_dapur" style="height: 80px">{{ old('alamat_dapur') }}</textarea>
                  <label>Alamat Pengambilan Logistik</label>
                </div>
              </div>

              <div id="fields-kurir" class="dynamic-field d-none bg-lighter p-3 rounded mb-4">
                <h6 class="fw-semibold">Detail Kendaraan Logistik</h6>
                <div class="form-floating form-floating-outline">
                  <input type="text" class="form-control text-uppercase" name="no_kendaraan"
                    placeholder="Contoh: B 1234 CD" value="{{ old('no_kendaraan') }}" />
                  <label>Nomor Polisi Kendaraan (Plat)</label>
                </div>
              </div>

              <button type="submit" class="btn btn-primary d-grid w-100 mb-5">Daftar Sekarang</button>
            </form>

            <p class="text-center">
              <span>Sudah memiliki akun?</span>
              <a href="{{ route('login') }}"><span>Masuk di sini</span></a>
            </p>
          </div>
        </div>
        <img alt="mask"
          src="{{ asset('assets/img/illustrations/auth-basic-register-mask-' . $configData['theme'] . '.png') }}"
          class="authentication-image d-none d-lg-block" />
      </div>
    </div>
  </div>
@endsection

@section('page-script')
  @vite(['resources/assets/js/pages-auth.js'])
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      const roleSelect = document.getElementById('roleSelect');
      const dynamicFields = document.querySelectorAll('.dynamic-field');

      function toggleFields() {
        // Sembunyikan semua field dinamis terlebih dahulu
        dynamicFields.forEach(el => el.classList.add('d-none'));

        // Tampilkan field sesuai role yang dipilih
        const selectedRole = roleSelect.value;
        if (selectedRole) {
          const targetField = document.getElementById('fields-' + selectedRole);
          if (targetField) {
            targetField.classList.remove('d-none');
          }
        }
      }

      // Jalankan saat role diubah
      roleSelect.addEventListener('change', toggleFields);

      // Jalankan saat halaman di-load (untuk mempertahankan state jika validasi gagal)
      toggleFields();
    });
  </script>
@endsection
