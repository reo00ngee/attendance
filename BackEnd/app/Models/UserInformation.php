<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class UserInformation
 * 
 * @property int $id
 * @property int $user_id
 * @property int $information_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Information $information
 * @property User $user
 *
 * @package App\Models
 */
class UserInformation extends Model
{
	use SoftDeletes;
	protected $table = 'user_information';

	protected $casts = [
		'user_id' => 'int',
		'information_id' => 'int'
	];

	protected $fillable = [
		'user_id',
		'information_id'
	];

	public function information()
	{
		return $this->belongsTo(Information::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
