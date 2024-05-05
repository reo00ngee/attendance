<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Company
 * 
 * @property int $id
 * @property string $name
 * @property string $address
 * @property string $phone_number
 * @property string $email
 * @property int $currency
 * @property int $closing_date
 * @property Carbon $last_closing_date
 * @property int $payroll_rounding_interval
 * @property int $prompt_submission_reminder_days
 * @property int $standard_working_hours
 * @property float|null $overtime_pay_multiplier
 * @property Carbon|null $night_shift_hours_from
 * @property Carbon|null $night_shift_hours_to
 * @property float|null $night_shift_pay_multiplier
 * @property float|null $holiday_pay_multiplier
 * @property bool $attendance_ready
 * @property bool $expense_ready
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 * 
 * @property Collection|Holiday[] $holidays
 * @property Collection|HourlyWageGroup[] $hourly_wage_groups
 * @property Collection|User[] $users
 *
 * @package App\Models
 */
class Company extends Model
{
	use SoftDeletes;
	protected $table = 'companies';

	protected $casts = [
		'currency' => 'int',
		'closing_date' => 'int',
		'last_closing_date' => 'datetime',
		'payroll_rounding_interval' => 'int',
		'prompt_submission_reminder_days' => 'int',
		'standard_working_hours' => 'int',
		'overtime_pay_multiplier' => 'float',
		'night_shift_hours_from' => 'datetime',
		'night_shift_hours_to' => 'datetime',
		'night_shift_pay_multiplier' => 'float',
		'holiday_pay_multiplier' => 'float',
		'attendance_ready' => 'bool',
		'expense_ready' => 'bool',
		'created_by' => 'int',
		'updated_by' => 'int',
		'deleted_by' => 'int'
	];

	protected $fillable = [
		'name',
		'address',
		'phone_number',
		'email',
		'currency',
		'closing_date',
		'last_closing_date',
		'payroll_rounding_interval',
		'prompt_submission_reminder_days',
		'standard_working_hours',
		'overtime_pay_multiplier',
		'night_shift_hours_from',
		'night_shift_hours_to',
		'night_shift_pay_multiplier',
		'holiday_pay_multiplier',
		'attendance_ready',
		'expense_ready',
		'created_by',
		'updated_by',
		'deleted_by'
	];

	public function created_by()
	{
		return $this->belongsTo(Administrator::class, 'created_by');
	}

	public function deleted_by()
	{
		return $this->belongsTo(Administrator::class, 'deleted_by');
	}

	public function updated_by()
	{
		return $this->belongsTo(Administrator::class, 'updated_by');
	}

	public function holidays()
	{
		return $this->hasMany(Holiday::class);
	}

	public function hourly_wage_groups()
	{
		return $this->hasMany(HourlyWageGroup::class);
	}

	public function users()
	{
		return $this->hasMany(User::class);
	}
}
