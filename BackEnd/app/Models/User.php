<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
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
}
