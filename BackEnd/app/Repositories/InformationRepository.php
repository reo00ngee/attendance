<?php

namespace App\Repositories;

use App\Models\Information;
use App\Models\UserInformation;
use App\Enums\SubmissionType;
use App\Enums\InformationType;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class InformationRepository
{
  public function getInformation($information_id)
  {
    return Information::where('id', $information_id)
      ->first();
  }

  public function createInformation($user_id, $submission_type, $information_type, $comment = null)
  {
    try {
      return DB::transaction(function () use ($user_id, $submission_type, $information_type, $comment) {
        $data = [
          'submission_type' => $submission_type,
          'information_type' => $information_type,
          'comment' => $comment,
        ];

        $information = Information::create($data);
        
        UserInformation::create([
          'user_id' => $user_id,
          'information_id' => $information->id,
        ]);
        
      });
    } catch (\Exception $e) {
      Log::error('Failed to create information: ' . $e->getMessage());
      throw $e;
    }
  }
}
