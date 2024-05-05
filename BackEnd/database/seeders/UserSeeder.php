<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('users')->insert([
            'first_name' => 'Reo',
            'last_name' => 'Ueno',
            'email' => 'reo00ngee@gmail.com',
            'password' => Hash::make('password'),
            'phone_number' => '1234567890',
            'gender' => '1',
            'birth_date' => '1990-01-01',
            'address' => '123 Main Street, City',
            'hire_date' => '2020-01-01',
            'retire_date' => null,
            'company_id' => 1,
            'hourly_wage_group_id' => 1,
            'created_at' => now(),
            'created_by' => 1,
            'updated_at' => now(),
            'updated_by' => 1,
            'deleted_at' => null,
            'deleted_by' => null,
        ]);
    }
}
