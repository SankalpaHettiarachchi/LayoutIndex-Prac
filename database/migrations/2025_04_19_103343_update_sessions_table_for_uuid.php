<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('sessions', function (Blueprint $table) {
            // Change user_id from unsignedBigInteger to uuid
            $table->uuid('user_id')->nullable()->change();

            // If you need to drop and recreate the index:
            $table->dropIndex(['user_id']);
            $table->index(['user_id']);
        });
    }

    public function down()
    {
        Schema::table('sessions', function (Blueprint $table) {
            // Revert back to unsignedBigInteger if needed
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->dropIndex(['user_id']);
            $table->index(['user_id']);
        });
    }
};
