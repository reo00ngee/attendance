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
 * @property int $user_id
 * @property Carbon|null $start_work_time
 * @property Carbon|null $finish_work_time
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $date
 *
 * @package App\Models
 */
class WorkTime extends Model
{
	protected $table = 'work_times';

	protected $casts = [
		'user_id' => 'int',
		'start_work_time' => 'datetime',
		'finish_work_time' => 'datetime',
		'date' => 'datetime'
	];

	protected $fillable = [
		'user_id',
		'start_work_time',
		'finish_work_time',
		'date'
	];
}
