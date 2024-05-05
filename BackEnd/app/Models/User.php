<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Class User
 * 
 * @property int $id
 * @property string|null $first_name
 * @property string|null $last_name
 * @property string $email
 * @property string $password
 * @property string|null $phone_number
 * @property int|null $gender
 * @property Carbon|null $birth_date
 * @property string|null $address
 * @property Carbon|null $hire_date
 * @property Carbon|null $retire_date
 * @property int|null $company_id
 * @property int|null $hourly_wage_group_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 * 
 * @property Company|null $company
 * @property HourlyWageGroup|null $hourly_wage_group
 * @property Collection|Attendance[] $attendances_where_created_by
 * @property Collection|Attendance[] $attendances_where_deleted_by
 * @property Collection|Attendance[] $attendances_where_updated_by
 * @property Collection|Attendance[] $attendances
 * @property Collection|AttendanceBreak[] $attendances_breaks_where_created_by
 * @property Collection|AttendanceBreak[] $attendances_breaks_where_deleted_by
 * @property Collection|AttendanceBreak[] $attendances_breaks_where_updated_by
 * @property Collection|AttendanceBreak[] $attendances_breaks
 * @property Collection|CommonlyUsedExpense[] $commonly_used_expenses_where_created_by
 * @property Collection|CommonlyUsedExpense[] $commonly_used_expenses_where_deleted_by
 * @property Collection|CommonlyUsedExpense[] $commonly_used_expenses_where_updated_by
 * @property Collection|CommonlyUsedExpense[] $commonly_used_expenses
 * @property Collection|CommonlyUsedExpensesAndDeduction[] $commonly_used_expenses_and_deductions_where_created_by
 * @property Collection|CommonlyUsedExpensesAndDeduction[] $commonly_used_expenses_and_deductions_where_deleted_by
 * @property Collection|CommonlyUsedExpensesAndDeduction[] $commonly_used_expenses_and_deductions_where_updated_by
 * @property Collection|CommonlyUsedExpensesAndDeduction[] $commonly_used_expenses_and_deductions
 * @property Collection|ExpensesAndDeduction[] $expenses_and_deductions_where_created_by
 * @property Collection|ExpensesAndDeduction[] $expenses_and_deductions_where_deleted_by
 * @property Collection|ExpensesAndDeduction[] $expenses_and_deductions_where_updated_by
 * @property Collection|ExpensesAndDeduction[] $expenses_and_deductions
 * @property Collection|Holiday[] $holidays_where_created_by
 * @property Collection|Holiday[] $holidays_where_deleted_by
 * @property Collection|Holiday[] $holidays_where_updated_by
 * @property Collection|HourlyWageGroup[] $hourly_wage_groups_where_created_by
 * @property Collection|HourlyWageGroup[] $hourly_wage_groups_where_deleted_by
 * @property Collection|HourlyWageGroup[] $hourly_wage_groups_where_updated_by
 * @property Collection|Information[] $information_where_created_by
 * @property Collection|Information[] $information_where_deleted_by
 * @property Collection|Information[] $information_where_updated_by
 * @property Collection|MonthlyExpensesAndDeduction[] $monthly_expenses_and_deductions_where_created_by
 * @property Collection|MonthlyExpensesAndDeduction[] $monthly_expenses_and_deductions_where_deleted_by
 * @property Collection|MonthlyExpensesAndDeduction[] $monthly_expenses_and_deductions_where_updated_by
 * @property Collection|MonthlyExpensesAndDeduction[] $monthly_expenses_and_deductions
 * @property Collection|PayslipContent[] $payslip_contents_where_created_by
 * @property Collection|PayslipContent[] $payslip_contents_where_deleted_by
 * @property Collection|PayslipContent[] $payslip_contents_where_updated_by
 * @property Collection|PayslipContent[] $payslip_contents
 * @property Collection|UserCreatedInformation[] $user_created_informations_where_created_by
 * @property Collection|UserCreatedInformation[] $user_created_informations_where_deleted_by
 * @property Collection|UserCreatedInformation[] $user_created_informations_where_updated_by
 * @property Collection|UserCreatedInformation[] $user_created_informations
 * @property Collection|Information[] $information
 * @property Collection|UserRole[] $user_roles_where_created_by
 * @property Collection|UserRole[] $user_roles_where_deleted_by
 * @property Collection|UserRole[] $user_roles_where_updated_by
 * @property Collection|UserRole[] $user_roles
 * @property Collection|User[] $users_where_created_by
 * @property Collection|User[] $users_where_deleted_by
 * @property Collection|User[] $users_where_updated_by
 *
 * @package App\Models
 */
class User extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable, SoftDeletes;
	protected $table = 'users';

	protected $casts = [
		'gender' => 'int',
		'birth_date' => 'datetime',
		'hire_date' => 'datetime',
		'retire_date' => 'datetime',
		'company_id' => 'int',
		'hourly_wage_group_id' => 'int',
		'created_by' => 'int',
		'updated_by' => 'int',
		'deleted_by' => 'int'
	];

	protected $hidden = [
		'password'
	];

	protected $fillable = [
		'first_name',
		'last_name',
		'email',
		'password',
		'phone_number',
		'gender',
		'birth_date',
		'address',
		'hire_date',
		'retire_date',
		'company_id',
		'hourly_wage_group_id',
		'created_by',
		'updated_by',
		'deleted_by'
	];

	public function company()
	{
		return $this->belongsTo(Company::class);
	}

	public function created_by()
	{
		return $this->belongsTo(User::class, 'created_by');
	}

	public function deleted_by()
	{
		return $this->belongsTo(User::class, 'deleted_by');
	}

	public function hourly_wage_group()
	{
		return $this->belongsTo(HourlyWageGroup::class);
	}

	public function updated_by()
	{
		return $this->belongsTo(User::class, 'updated_by');
	}

	public function attendances_where_created_by()
	{
		return $this->hasMany(Attendance::class, 'created_by');
	}

	public function attendances_where_deleted_by()
	{
		return $this->hasMany(Attendance::class, 'deleted_by');
	}

	public function attendances_where_updated_by()
	{
		return $this->hasMany(Attendance::class, 'updated_by');
	}

	public function attendances()
	{
		return $this->hasMany(Attendance::class);
	}

	public function attendances_breaks_where_created_by()
	{
		return $this->hasMany(AttendanceBreak::class, 'created_by');
	}

	public function attendances_breaks_where_deleted_by()
	{
		return $this->hasMany(AttendanceBreak::class, 'deleted_by');
	}

	public function attendances_breaks_where_updated_by()
	{
		return $this->hasMany(AttendanceBreak::class, 'updated_by');
	}

	public function attendances_breaks()
	{
		return $this->hasMany(AttendanceBreak::class);
	}

	public function commonly_used_expenses_where_created_by()
	{
		return $this->hasMany(CommonlyUsedExpense::class, 'created_by');
	}

	public function commonly_used_expenses_where_deleted_by()
	{
		return $this->hasMany(CommonlyUsedExpense::class, 'deleted_by');
	}

	public function commonly_used_expenses_where_updated_by()
	{
		return $this->hasMany(CommonlyUsedExpense::class, 'updated_by');
	}

	public function commonly_used_expenses()
	{
		return $this->hasMany(CommonlyUsedExpense::class);
	}

	public function commonly_used_expenses_and_deductions_where_created_by()
	{
		return $this->hasMany(CommonlyUsedExpensesAndDeduction::class, 'created_by');
	}

	public function commonly_used_expenses_and_deductions_where_deleted_by()
	{
		return $this->hasMany(CommonlyUsedExpensesAndDeduction::class, 'deleted_by');
	}

	public function commonly_used_expenses_and_deductions_where_updated_by()
	{
		return $this->hasMany(CommonlyUsedExpensesAndDeduction::class, 'updated_by');
	}

	public function commonly_used_expenses_and_deductions()
	{
		return $this->hasMany(CommonlyUsedExpensesAndDeduction::class);
	}

	public function expenses_and_deductions_where_created_by()
	{
		return $this->hasMany(ExpensesAndDeduction::class, 'created_by');
	}

	public function expenses_and_deductions_where_deleted_by()
	{
		return $this->hasMany(ExpensesAndDeduction::class, 'deleted_by');
	}

	public function expenses_and_deductions_where_updated_by()
	{
		return $this->hasMany(ExpensesAndDeduction::class, 'updated_by');
	}

	public function expenses_and_deductions()
	{
		return $this->hasMany(ExpensesAndDeduction::class);
	}

	public function holidays_where_created_by()
	{
		return $this->hasMany(Holiday::class, 'created_by');
	}

	public function holidays_where_deleted_by()
	{
		return $this->hasMany(Holiday::class, 'deleted_by');
	}

	public function holidays_where_updated_by()
	{
		return $this->hasMany(Holiday::class, 'updated_by');
	}

	public function hourly_wage_groups_where_created_by()
	{
		return $this->hasMany(HourlyWageGroup::class, 'created_by');
	}

	public function hourly_wage_groups_where_deleted_by()
	{
		return $this->hasMany(HourlyWageGroup::class, 'deleted_by');
	}

	public function hourly_wage_groups_where_updated_by()
	{
		return $this->hasMany(HourlyWageGroup::class, 'updated_by');
	}

	public function information_where_created_by()
	{
		return $this->hasMany(Information::class, 'created_by');
	}

	public function information_where_deleted_by()
	{
		return $this->hasMany(Information::class, 'deleted_by');
	}

	public function information_where_updated_by()
	{
		return $this->hasMany(Information::class, 'updated_by');
	}

	public function monthly_expenses_and_deductions_where_created_by()
	{
		return $this->hasMany(MonthlyExpensesAndDeduction::class, 'created_by');
	}

	public function monthly_expenses_and_deductions_where_deleted_by()
	{
		return $this->hasMany(MonthlyExpensesAndDeduction::class, 'deleted_by');
	}

	public function monthly_expenses_and_deductions_where_updated_by()
	{
		return $this->hasMany(MonthlyExpensesAndDeduction::class, 'updated_by');
	}

	public function monthly_expenses_and_deductions()
	{
		return $this->hasMany(MonthlyExpensesAndDeduction::class);
	}

	public function payslip_contents_where_created_by()
	{
		return $this->hasMany(PayslipContent::class, 'created_by');
	}

	public function payslip_contents_where_deleted_by()
	{
		return $this->hasMany(PayslipContent::class, 'deleted_by');
	}

	public function payslip_contents_where_updated_by()
	{
		return $this->hasMany(PayslipContent::class, 'updated_by');
	}

	public function payslip_contents()
	{
		return $this->hasMany(PayslipContent::class);
	}

	public function user_created_informations_where_created_by()
	{
		return $this->hasMany(UserCreatedInformation::class, 'created_by');
	}

	public function user_created_informations_where_deleted_by()
	{
		return $this->hasMany(UserCreatedInformation::class, 'deleted_by');
	}

	public function user_created_informations_where_updated_by()
	{
		return $this->hasMany(UserCreatedInformation::class, 'updated_by');
	}

	public function user_created_informations()
	{
		return $this->hasMany(UserCreatedInformation::class);
	}

	public function information()
	{
		return $this->belongsToMany(Information::class, 'user_information')
					->withPivot('id', 'deleted_at')
					->withTimestamps();
	}

	public function user_roles_where_created_by()
	{
		return $this->hasMany(UserRole::class, 'created_by');
	}

	public function user_roles_where_deleted_by()
	{
		return $this->hasMany(UserRole::class, 'deleted_by');
	}

	public function user_roles_where_updated_by()
	{
		return $this->hasMany(UserRole::class, 'updated_by');
	}

	public function user_roles()
	{
		return $this->hasMany(UserRole::class);
	}

	public function users_where_created_by()
	{
		return $this->hasMany(User::class, 'created_by');
	}

	public function users_where_deleted_by()
	{
		return $this->hasMany(User::class, 'deleted_by');
	}

	public function users_where_updated_by()
	{
		return $this->hasMany(User::class, 'updated_by');
	}
}
