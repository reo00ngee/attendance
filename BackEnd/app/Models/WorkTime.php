<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class WorkTime
 * 
 * @property int $id
 * @property Carbon|null $start_work_time
 * @property Carbon|null $finish_work_time
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int $user_id
 *
 * @package App\Models
 */
class WorkTime extends Model
{
	protected $table = 'work_times';

	protected $casts = [
		'start_work_time' => 'datetime',
		'finish_work_time' => 'datetime',
		'user_id' => 'int'
	];

	protected $fillable = [
		'start_work_time',
		'finish_work_time',
		'user_id'
	];

	public function user()
	{
			return $this->belongsTo(User::class);
	}
}
