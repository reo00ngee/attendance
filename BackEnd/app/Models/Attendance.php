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
 * Class Attendance
 * 
 * @property int $id
 * @property int $user_id
 * @property Carbon $start_time
 * @property Carbon $end_time
 * @property bool $is_holiday
 * @property string|null $comment
 * @property int $submission_status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 * 
 * @property User $user
 * @property Collection|AttendanceBreak[] $attendanceBreaks
 *
 * @package App\Models
 */
class Attendance extends Model
{
	use SoftDeletes;
	protected $table = 'attendance';

	protected $casts = [
		'user_id' => 'int',
		'start_time' => 'datetime',
		'end_time' => 'datetime',
		'is_holiday' => 'bool',
		'submission_status' => 'int',
		'created_by' => 'int',
		'updated_by' => 'int',
		'deleted_by' => 'int'
	];

	protected $fillable = [
		'user_id',
		'start_time',
		'end_time',
		'is_holiday',
		'comment',
		'submission_status',
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

	public function attendanceBreaks()
	{
			return $this->hasMany(AttendanceBreak::class);
	}
}
