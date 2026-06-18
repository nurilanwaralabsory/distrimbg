@php
  $configData = Helper::appClasses();
  $customizerHidden = 'customizer-hide';
@endphp

@extends('layouts/layoutMaster')

@section('title', 'Masuk - DistriMBG')

@section('vendor-style')
  @vite(['resources/assets/vendor/libs/@form-validation/form-validation.scss'])
@endsection

@section('page-style')
  @vite(['resources/assets/vendor/scss/pages/page-auth.scss'])
@endsection

@section('vendor-script')
  @vite(['resources/assets/vendor/libs/@form-validation/popular.js', 'resources/assets/vendor/libs/@form-validation/bootstrap5.js', 'resources/assets/vendor/libs/@form-validation/auto-focus.js'])
@endsection

@section('page-script')
  @vite(['resources/assets/js/pages-auth.js'])
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
            <h4 class="mb-1">Selamat Datang di DistriMBG! 👋</h4>
            <p class="mb-5">Silakan masuk ke akun kemitraan Anda</p>
            @if (session('success'))
              <div class="alert alert-outline-primary alert-dismissible mb-4" role="alert">
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            @endif

            @if (session('error'))
              <div class="alert alert-danger alert-dismissible mb-4" role="alert">
                {{ session('error') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            @endif

            <form id="formAuthentication" class="mb-5" action="{{ route('login') }}" method="POST">
              @csrf

              <div class="form-floating form-floating-outline mb-5 form-control-validation">
                <input type="email" class="form-control" id="email" name="email"
                  placeholder="Masukkan email terdaftar" autofocus required />
                <label for="email">Email</label>
              </div>

              <div class="mb-5">
                <div class="form-password-toggle form-control-validation">
                  <div class="input-group input-group-merge">
                    <div class="form-floating form-floating-outline">
                      <input type="password" id="password" class="form-control" name="password"
                        placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                        aria-describedby="password" required />
                      <label for="password">Password</label>
                    </div>
                    <span class="input-group-text cursor-pointer"><i
                        class="icon-base ri ri-eye-off-line icon-20px"></i></span>
                  </div>
                </div>
              </div>

              <div class="mb-5 d-flex justify-content-between mt-5">
                <div class="form-check mt-2">
                  <input class="form-check-input" type="checkbox" id="remember-me" name="remember" />
                  <label class="form-check-label" for="remember-me"> Ingat Saya </label>
                </div>
                <a href="{{ url('auth/forgot-password-basic') }}" class="float-end mb-1 mt-2">
                  <span>Lupa Password?</span>
                </a>
              </div>

              <div class="mb-5">
                <button class="btn btn-primary d-grid w-100" type="submit">Masuk</button>
              </div>
            </form>

            <p class="text-center">
              <span>Belum memiliki akun kemitraan?</span>
              <a href="{{ url('auth/register-basic') }}">
                <span>Daftar di sini</span>
              </a>
            </p>
          </div>
        </div>
        <img alt="mask"
          src="{{ asset('assets/img/illustrations/auth-basic-login-mask-' . $configData['theme'] . '.png') }}"
          class="authentication-image d-none d-lg-block"
          data-app-light-img="illustrations/auth-basic-login-mask-light.png"
          data-app-dark-img="illustrations/auth-basic-login-mask-dark.png" />
      </div>
    </div>
  </div>
@endsection
