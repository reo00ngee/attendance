<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class UserCreatedInformation
 * 
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string|null $content
 * @property Carbon|null $published_at
 * @property Carbon|null $expires_at
 * @property bool $is_active
 * @property int|null $submission_type
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 * 
 * @property User $user
 *
 * @package App\Models
 */
class UserCreatedInformation extends Model
{
	use SoftDeletes;
	protected $table = 'user_created_information';

	protected $casts = [
		'user_id' => 'int',
		'published_at' => 'datetime',
		'expires_at' => 'datetime',
		'is_active' => 'bool',
		'submission_type' => 'int',
		'created_by' => 'int',
		'updated_by' => 'int',
		'deleted_by' => 'int'
	];

	protected $fillable = [
		'user_id',
		'title',
		'content',
		'published_at',
		'expires_at',
		'is_active',
		'submission_type',
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
