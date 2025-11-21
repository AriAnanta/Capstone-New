<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'app')->name('spa');

Route::view('/{any}', 'app')
    ->where('any', '^(?!api).*$')
    ->name('spa.fallback');
