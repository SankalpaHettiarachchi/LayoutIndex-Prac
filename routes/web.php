<?php

use App\Http\Controllers\ConcessionsController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::Resource('/concessions', ConcessionsController::class)->middleware(['auth', 'verified'])->names('concessions');
Route::Resource('/orders', OrdersController::class)->middleware(['auth', 'verified'])->names('orders');
Route::get('/orders/create/load-concessions', [OrdersController::class, 'loadConcessions'])->name('orders.load-concessions');
Route::post('/orders/{order}/send', [OrdersController::class, 'send'])->name('orders.send');
Route::Resource('/kitchen', KitchenController::class)->middleware(['auth', 'verified'])->names('kitchen');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
