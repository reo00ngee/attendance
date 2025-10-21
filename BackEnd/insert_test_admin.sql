-- テスト用管理者アカウントを挿入
-- パスワードは 'password123' をハッシュ化したもの

INSERT INTO administrators (name, email, password, created_by, updated_by, created_at, updated_at) 
VALUES (
    'Test Admin', 
    'admin@test.com', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    1, 
    1, 
    NOW(), 
    NOW()
);

-- 既存の管理者アカウントも確認
SELECT id, name, email, created_at FROM administrators;








