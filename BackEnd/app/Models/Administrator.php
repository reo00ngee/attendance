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
 * Class Administrator
 * 
 * @property int $id
 * @property string $email
 * @property string $password
 * @property string|null $name
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 * @property string|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Company[] $companies_where_created_by
 * @property Collection|Company[] $companies_where_deleted_by
 * @property Collection|Company[] $companies_where_updated_by
 *
 * @package App\Models
 */
class Administrator extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable, SoftDeletes;
	protected $table = 'administrators';

	protected $casts = [
		'created_by' => 'int',
		'updated_by' => 'int',
		'deleted_by' => 'int'
	];

	protected $hidden = [
		'password'
	];

	protected $fillable = [
		'email',
		'password',
		'name',
		'created_by',
		'updated_by',
		'deleted_by'
	];

	public function companies_where_created_by()
	{
		return $this->hasMany(Company::class, 'created_by');
	}

	public function companies_where_deleted_by()
	{
		return $this->hasMany(Company::class, 'deleted_by');
	}

	public function companies_where_updated_by()
	{
		return $this->hasMany(Company::class, 'updated_by');
	}
}
