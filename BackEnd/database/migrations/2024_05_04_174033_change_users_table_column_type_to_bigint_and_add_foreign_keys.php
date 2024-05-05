<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeUsersTableColumnTypeToBigintAndAddForeignKeys extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Change column types to bigint
            $table->bigIncrements('id')->change();
            $table->unsignedBigInteger('company_id')->change();
            $table->unsignedBigInteger('hourly_wage_group_id')->change();
            $table->unsignedBigInteger('created_by')->nullable()->change();
            $table->unsignedBigInteger('updated_by')->nullable()->change();
            $table->unsignedBigInteger('deleted_by')->nullable()->change();

            // Add foreign key constraints
            // $table->foreign('company_id')
            //       ->references('id')->on('companies')
            //       ->onDelete('cascade');

            $table->foreign('hourly_wage_group_id')
                  ->references('id')->on('hourly_wage_groups');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop foreign key constraints
            $table->dropForeign(['company_id']);
            $table->dropForeign(['hourly_wage_group_id']);

            // Change column types back to integer
            $table->increments('id')->change();
            $table->unsignedInteger('company_id')->change();
            $table->unsignedInteger('hourly_wage_group_id')->change();
            $table->unsignedInteger('created_by')->nullable()->change();
            $table->unsignedInteger('updated_by')->nullable()->change();
            $table->unsignedInteger('deleted_by')->nullable()->change();
        });
    }
}
