@extends('layouts.app')
@section('title', 'Главная страница - TimeToCoffee')
@section('content')
    <!-- Hero Section -->
    @include('home.hero')

    <!-- About Section -->
    @include('home.about')

    <!-- History Section -->
    @include('home.history')

    <!-- Features Section -->
    @include('home.features')

    <!-- Events Section -->
    @include('home.events')

    <!-- App Section -->
    @include('home.app')

    <!-- Booking Section -->
    @include('home.booking')
@endsection
