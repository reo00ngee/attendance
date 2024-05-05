<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InformationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('information')->insert([
            [
                'submission_type' => 1,
                'information_type' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
