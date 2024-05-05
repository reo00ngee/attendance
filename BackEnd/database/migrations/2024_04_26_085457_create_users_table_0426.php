<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
            Schema::create('users', function (Blueprint $table) {
                $table->increments('id')->unique(); // Unique user identifier
                $table->string('first_name', 30)->nullable()->unique(); // User's first name
                $table->string('last_name', 30)->nullable()->unique(); // User's last name
                $table->string('email', 255)->unique(); // User's email address
                $table->string('password', 255); // User's password
                $table->string('phone_number', 20)->nullable()->unique(); // User's phone number
                $table->string('gender', 10)->nullable(); // User's gender
                $table->date('birth_date')->nullable(); // User's birth date
                $table->string('address', 255)->nullable(); // User's address
                $table->date('hire_date')->nullable(); // User's hire date
                $table->date('retire_date')->nullable(); // User's retire date
                $table->unsignedInteger('company_id')->nullable(); // Foreign key referencing Company's ID
                $table->unsignedInteger('hourly_wage_group_id')->nullable(); // Foreign key referencing Hourly wage group's ID
                $table->timestamps(); // Time when the record was created and last updated
                $table->softDeletes(); // Time when the record was soft deleted
                $table->unsignedInteger('created_by')->nullable(); // User ID of the creator
                $table->unsignedInteger('updated_by')->nullable(); // User ID of the last updater
                $table->unsignedInteger('deleted_by')->nullable(); // User ID of the deleter
    
                // Indexes
                $table->index('email'); // Unique index on the email column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
