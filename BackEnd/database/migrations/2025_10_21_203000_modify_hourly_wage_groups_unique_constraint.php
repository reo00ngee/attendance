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
        Schema::table('hourly_wage_groups', function (Blueprint $table) {
            // Drop the existing global unique constraint on name
            $table->dropUnique(['name']);
            
            // Add company-specific unique constraint (company_id + name)
            $table->unique(['company_id', 'name'], 'unique_name_per_company');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hourly_wage_groups', function (Blueprint $table) {
            // Drop the company-specific unique constraint
            $table->dropUnique('unique_name_per_company');
            
            // Restore the global unique constraint on name
            $table->unique('name');
        });
    }
};
