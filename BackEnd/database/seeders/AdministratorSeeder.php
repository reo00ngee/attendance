<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdministratorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('administrators')->insert([
            'email' => 'reo00ngee@gmail.com',
            'password' => Hash::make('password'), // パスワードをハッシュ化
            'name' => 'Admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
