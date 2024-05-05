<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class BreakTime
 * 
 * @property int $id
 * @property int $work_time_id
 * @property Carbon|null $start_break_time
 * @property Carbon|null $finish_break_time
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class BreakTime extends Model
{
	protected $table = 'break_times';

	protected $casts = [
		'work_time_id' => 'int',
		'start_break_time' => 'datetime',
		'finish_break_time' => 'datetime'
	];

	protected $fillable = [
		'work_time_id',
		'start_break_time',
		'finish_break_time'
	];
}
