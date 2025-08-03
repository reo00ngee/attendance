<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToUserInformationTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_information', function (Blueprint $table) {
            // 既存の外部キー制約があれば削除
            $table->dropForeign(['user_id']);
            $table->dropForeign(['information_id']);
            
            // カスケード削除付きの外部キー制約を追加
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
                  
            $table->foreign('information_id')
                  ->references('id')
                  ->on('information')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_information', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['information_id']);
            
            // 元の制約に戻す（制約なしまたは元の設定）
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('information_id')->references('id')->on('information');
        });
    }
};
