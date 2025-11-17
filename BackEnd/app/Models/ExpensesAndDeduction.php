<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Testing\Fluent\Concerns\Has;

/**
 * Class ExpensesAndDeduction
 * 
 * @property int $id
 * @property int $user_id
 * @property int $expense_or_deduction
 * @property string $name
 * @property float $amount
 * @property Carbon $date
 * @property int $submission_status
 * @property string|null $comment
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 * 
 * @property User $user
 *
 * @package App\Models
 */
class ExpensesAndDeduction extends Model
{
	use SoftDeletes;
	use HasFactory;
	protected $table = 'expenses_and_deductions';

	protected $casts = [
		'user_id' => 'int',
		'expense_or_deduction' => 'int',
		'amount' => 'float',
		'date' => 'datetime',
		'submission_status' => 'int',
		'created_by' => 'int',
		'updated_by' => 'int',
		'deleted_by' => 'int'
	];

	protected $fillable = [
		'user_id',
		'expense_or_deduction',
		'name',
		'amount',
		'date',
		'submission_status',
		'comment',
		'created_by',
		'updated_by',
		'deleted_by'
	];

	public function created_by()
	{
		return $this->belongsTo(User::class, 'created_by');
	}

	public function deleted_by()
	{
		return $this->belongsTo(User::class, 'deleted_by');
	}

	public function updated_by()
	{
		return $this->belongsTo(User::class, 'updated_by');
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
