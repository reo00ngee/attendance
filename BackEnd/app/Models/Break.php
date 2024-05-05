<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Break
 * 
 * @property int $id
 * @property int $user_id
 * @property int $attendance_id
 * @property Carbon $start_time
 * @property Carbon $end_time
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 * @property string|null $deleted_at
 * 
 * @property Attendance $attendance
 * @property User $user
 *
 * @package App\Models
 */
class Break extends Model
{
	use SoftDeletes;
	protected $table = 'breaks';

	protected $casts = [
		'user_id' => 'int',
		'attendance_id' => 'int',
		'start_time' => 'datetime',
		'end_time' => 'datetime',
		'created_by' => 'int',
		'updated_by' => 'int',
		'deleted_by' => 'int'
	];

	protected $fillable = [
		'user_id',
		'attendance_id',
		'start_time',
		'end_time',
		'created_by',
		'updated_by',
		'deleted_by'
	];

	public function attendance()
	{
		return $this->belongsTo(Attendance::class);
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

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
