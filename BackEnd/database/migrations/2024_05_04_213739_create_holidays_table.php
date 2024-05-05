<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHolidaysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('holidays', function (Blueprint $table) {
            $table->id();
            $table->date('date')->nullable(false);
            $table->unsignedBigInteger('company_id')->nullable(false);
            $table->foreign('company_id')->references('id')->on('companies');
            $table->string('description', 255)->nullable();
            $table->timestamps(); // Time when the record was created and last updated
            $table->softDeletes(); // Time when the record was soft deleted
            $table->unsignedBigInteger('created_by')->nullable(); // User ID of the creator
            $table->unsignedBigInteger('updated_by')->nullable(); // User ID of the last updater
            $table->unsignedBigInteger('deleted_by')->nullable(); // User ID of the deleter
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('deleted_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('holidays');
    }
}
