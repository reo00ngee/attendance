<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ExpensesAndDeduction;
use App\Enums\ExpenseOrDeduction;
use App\Enums\SubmissionStatus;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExpensesAndDeduction>
 */
class ExpensesAndDeductionFactory extends Factory
{
    protected $model = ExpensesAndDeduction::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 6,
            'expense_or_deduction' => ExpenseOrDeduction::EXPENSE->value,
            'name' => $this->faker->word(),
            'amount' => $this->faker->randomFloat(2, 100, 10000),
            'date' => $this->faker->date(),
            'submission_status' => SubmissionStatus::CREATED->value,
            'comment' => $this->faker->optional()->sentence(),
        ];
    }
}
