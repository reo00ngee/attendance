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
 * Class HourlyWageGroup
 * 
 * @property int $id
 * @property int $company_id
 * @property string $name
 * @property float $hourly_wage
 * @property string|null $comment
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 * 
 * @property Company $company
 * @property Collection|User[] $users
 *
 * @package App\Models
 */
class HourlyWageGroup extends Model
{
	use SoftDeletes;
	protected $table = 'hourly_wage_groups';

	protected $casts = [
		'company_id' => 'int',
		'hourly_wage' => 'float',
		'created_by' => 'int',
		'updated_by' => 'int',
		'deleted_by' => 'int'
	];

	protected $fillable = [
		'company_id',
		'name',
		'hourly_wage',
		'comment',
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

	public function updated_by()
	{
		return $this->belongsTo(User::class, 'updated_by');
	}

	public function users()
	{
		return $this->hasMany(User::class);
	}
}
