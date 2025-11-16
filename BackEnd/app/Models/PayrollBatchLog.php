<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class PayrollBatchLog extends Model
{
    protected $table = 'payroll_batch_logs';

    protected $fillable = [
        'company_id',
        'user_id',
        'status',
        'error_message',
        'processed_at',
    ];

    protected $casts = [
        'company_id' => 'int',
        'user_id' => 'int',
        'processed_at' => 'datetime',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}


