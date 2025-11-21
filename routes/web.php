<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'app')->name('spa');

Route::view('/{view}', 'app')
    ->where('view', '^(?!api).*$')
    ->name('spa.fallback');
