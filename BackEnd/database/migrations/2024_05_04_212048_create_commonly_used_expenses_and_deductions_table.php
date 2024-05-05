<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommonlyUsedExpensesAndDeductionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('commonly_used_expenses_and_deductions', function (Blueprint $table) {
            $table->bigIncrements('id'); // Unique identifier
            $table->unsignedBigInteger('user_id')->nullable(false); // Foreign key referencing Users.id
            $table->foreign('user_id')->references('id')->on('users');
            $table->unsignedBigInteger('expense_or_deduction')->nullable(false); // Expense or deduction (Enum)
            $table->string('name', 30)->nullable(false); // Name of expense or deduction
            $table->decimal('amount', 10, 2)->nullable(false); // Amount of expense or deduction
            $table->date('date')->nullable(false); // Date of the transaction
            $table->unsignedBigInteger('submission_status')->nullable(false); // Submission status
            $table->text('comment')->nullable(); // Comment
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
        Schema::dropIfExists('expenses_and_deductions');
    }
}
