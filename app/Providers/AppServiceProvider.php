<?php

namespace App\Providers;

use App\Interfaces\ConcessionsInterface;
use App\Interfaces\KithchenInterface;
use App\Interfaces\OrdersInterface;
use App\Models\Concession;
use App\Models\Order;
use App\Observers\ConcessionObserver;
use App\Observers\OrderObserver;
use App\Repositories\ConcessionsRepository;
use App\Repositories\KitchenRepository;
use App\Repositories\OrdersRepository;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            ConcessionsInterface::class,
            ConcessionsRepository::class
        );

        $this->app->bind(
            OrdersInterface::class,
            OrdersRepository::class
        );
        $this->app->bind(
            KithchenInterface::class,
            KitchenRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Concession::observe(ConcessionObserver::class);
        Order::observe(OrderObserver::class);
    }
}
