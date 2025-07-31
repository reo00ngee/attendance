<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\SubmissionType;
use App\Enums\InformationType;


/**
 * Class Information
 * 
 * @property int $id
 * @property int $submission_type
 * @property int $information_type
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 * 
 * @property Collection|User[] $users
 *
 * @package App\Models
 */
class Information extends Model
{
	use SoftDeletes;
	protected $table = 'information';

	protected $casts = [
		'submission_type' => SubmissionType::class,
		'information_type' => InformationType::class,
		'created_by' => 'int',
		'updated_by' => 'int',
		'deleted_by' => 'int'
	];

	protected $fillable = [
		'submission_type',
		'information_type',
		'comment',
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

	public function users()
	{
		return $this->belongsToMany(User::class, 'user_information')
					->withPivot('id', 'deleted_at')
					->withTimestamps();
	}
}
