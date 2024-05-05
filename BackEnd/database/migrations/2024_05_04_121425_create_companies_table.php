<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id(); // Unique company identifier
            $table->string('name', 30)->unique(); // Company's name
            $table->string('address', 255); // Company's address
            $table->string('phone_number', 20); // Company's phone number
            $table->string('email', 255); // Company's email
            $table->unsignedBigInteger('currency')->index(); // Setting for currency
            $table->unsignedBigInteger('closing_date')->index(); // Setting for closing date
            $table->date('last_closing_date')->index()->default(now()); // Last closing date
            $table->unsignedBigInteger('payroll_rounding_interval'); // Setting for payroll rounding interval
            $table->unsignedBigInteger('prompt_submission_reminder_days'); // Setting for prompt submission reminder days
            $table->unsignedBigInteger('standard_working_hours'); // Setting for standard working hours
            $table->decimal('overtime_pay_multiplier', 5, 2)->nullable(); // Multiplier for overtime pay
            $table->time('night_shift_hours_from')->nullable(); // Night shift starting hour
            $table->time('night_shift_hours_to')->nullable(); // Night shift ending hour
            $table->decimal('night_shift_pay_multiplier', 5, 2)->nullable(); // Multiplier for night shift pay
            $table->decimal('holiday_pay_multiplier', 5, 2)->nullable(); // Multiplier for holiday pay
            $table->boolean('attendance_ready')->default(false); // Flag indicating if attendance data is ready
            $table->boolean('expense_ready')->default(false); // Flag indicating if expense data is ready
            $table->timestamps(); // Time when the record was created and last updated
            $table->softDeletes(); // Time when the record was soft deleted
            // $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            // $table->foreign('updated_by')->references('id')->on('users')->onDelete('cascade');
            // $table->foreign('deleted_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('companies');
    }
}
