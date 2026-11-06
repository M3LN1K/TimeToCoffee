<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('pages.home');
})->name('home');

Route::get('/menu', function (){
   return view('pages.menu');
})->name('menu');
