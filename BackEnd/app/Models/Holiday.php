<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Holiday
 * 
 * @property int $id
 * @property Carbon $date
 * @property int $company_id
 * @property string|null $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 * 
 * @property Company $company
 *
 * @package App\Models
 */
class Holiday extends Model
{
	use SoftDeletes;
	protected $table = 'holidays';

	protected $casts = [
		'date' => 'datetime',
		'company_id' => 'int',
		'created_by' => 'int',
		'updated_by' => 'int',
		'deleted_by' => 'int'
	];

	protected $fillable = [
		'date',
		'company_id',
		'description',
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
}
