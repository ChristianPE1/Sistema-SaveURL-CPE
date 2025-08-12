<?php

use Illuminate\Support\Facades\Route;

// ruta default para verificar que la API está funcionando
Route::get('/', function () {
    return response()->json([
        'message' => 'Laravel API funcionando correctamente',
        'version' => app()->version(),
        'time' => now()->toDateTimeString()
    ]);
});
