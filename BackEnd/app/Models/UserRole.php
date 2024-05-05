<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class UserRole
 * 
 * @property int $id
 * @property int $user_id
 * @property int $role
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property string|null $deleted_at
 * @property int|null $deleted_by
 * 
 * @property User $user
 *
 * @package App\Models
 */
class UserRole extends Model
{
	use SoftDeletes;
	protected $table = 'user_role';

	protected $casts = [
		'user_id' => 'int',
		'role' => 'int',
		'created_by' => 'int',
		'updated_by' => 'int',
		'deleted_by' => 'int'
	];

	protected $fillable = [
		'user_id',
		'role',
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
