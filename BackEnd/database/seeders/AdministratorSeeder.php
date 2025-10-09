<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Administrator;
use Illuminate\Support\Facades\Hash;

class AdministratorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // デフォルトのスーパーアドミンを作成
        Administrator::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'created_by' => 1,
            'updated_by' => 1,
        ]);

        // 追加のアドミンアカウントを作成
        Administrator::create([
            'name' => 'System Administrator',
            'email' => 'system@example.com',
            'password' => Hash::make('system123'),
            'created_by' => 1,
            'updated_by' => 1,
        ]);

        // 開発用アドミンアカウント
        Administrator::create([
            'name' => 'Developer Admin',
            'email' => 'dev@example.com',
            'password' => Hash::make('dev123'),
            'created_by' => 1,
            'updated_by' => 1,
        ]);

        $this->command->info('Administrator accounts created successfully!');
        $this->command->info('Default admin credentials:');
        $this->command->info('Email: admin@example.com, Password: admin123');
        $this->command->info('Email: system@example.com, Password: system123');
        $this->command->info('Email: dev@example.com, Password: dev123');
    }
}