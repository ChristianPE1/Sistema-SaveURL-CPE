<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CategoryController;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
   Route::get('/user', function (Request $request) {
      return $request->user();
   });

   Route::apiResource('posts', PostController::class);
   Route::patch('posts/{post}/favorite', [PostController::class, 'toggleFavorite']);
   Route::apiResource('categories', CategoryController::class);
});

// Route::get('/',function () {
//     return 'API';
// });

Route::post('/register',[AuthController::class, 'register']);
Route::post('/login',[AuthController::class, 'login']);
Route::post('/logout',[AuthController::class, 'logout'])->middleware('auth:sanctum');