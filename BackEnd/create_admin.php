<?php

require_once 'vendor/autoload.php';

use App\Models\Administrator;
use Illuminate\Support\Facades\Hash;

// Laravelアプリケーションを起動
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // 管理者アカウントを作成
    $admin = Administrator::create([
        'name' => 'Test Admin',
        'email' => 'admin@test.com',
        'password' => Hash::make('password123'),
        'created_by' => 1,
        'updated_by' => 1,
    ]);
    
    echo "管理者アカウントが作成されました:\n";
    echo "Email: admin@test.com\n";
    echo "Password: password123\n";
    echo "ID: " . $admin->id . "\n";
    
} catch (Exception $e) {
    echo "エラー: " . $e->getMessage() . "\n";
    echo "管理者テーブルが存在しない可能性があります。マイグレーションを実行してください。\n";
}

