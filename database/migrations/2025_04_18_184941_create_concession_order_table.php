<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('concession_order', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(Str::uuid());
            $table->foreignUuid('order_id')->constrained('order');
            $table->foreignUuid('concession_id')->constrained('concession');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->timestamps();

            // Ensure unique combinations
            $table->unique(['order_id', 'concession_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('concession_order');
    }
};
