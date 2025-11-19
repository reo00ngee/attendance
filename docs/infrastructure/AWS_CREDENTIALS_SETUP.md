# AWS認証情報の設定方法

## 📋 CSVファイルの内容

ダウンロードしたCSVファイルには以下の情報が含まれています：

```
User name,Access key ID,Secret access key
attendance-deploy-user,AKIAIOSFODNN7EXAMPLE,wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

## 🔐 認証情報の設定方法

### 方法1: aws configureコマンドを使用（推奨）

1. CSVファイルを開いて、以下の情報を確認：
   - **Access key ID**（例: `AKIAIOSFODNN7EXAMPLE`）
   - **Secret access key**（例: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`）

2. ターミナルで以下のコマンドを実行：

```bash
aws configure
```

3. 以下の情報を順番に入力：

```
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: ap-northeast-1
Default output format [None]: json
```

4. 設定が完了したら確認：

```bash
aws sts get-caller-identity
```

アカウント情報が表示されれば成功です。

---

### 方法2: 設定ファイルを直接編集

1. 設定ファイルの場所を確認：

```bash
cat ~/.aws/credentials
cat ~/.aws/config
```

2. ファイルを直接編集：

```bash
# credentialsファイルを編集
nano ~/.aws/credentials
```

以下の形式で記述：

```ini
[default]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

```bash
# configファイルを編集
nano ~/.aws/config
```

以下の形式で記述：

```ini
[default]
region = ap-northeast-1
output = json
```

---

## ⚠️ セキュリティに関する重要な注意事項

### CSVファイルの取り扱い

1. **CSVファイルは安全な場所に保管**
   - パスワードマネージャーに保存
   - 暗号化されたストレージに保存
   - **Gitリポジトリには絶対にコミットしない**

2. **CSVファイルを削除する場合**
   - 認証情報を設定した後、CSVファイルは削除してもOK
   - ただし、シークレットキーは一度しか表示されないため、安全な場所にバックアップを取ることを推奨

3. **.gitignoreに追加（重要）**
   ```bash
   echo "*.csv" >> .gitignore
   echo ".aws/" >> .gitignore
   ```

### 認証情報の漏洩を防ぐ

- ✅ 認証情報は環境変数やSecrets Managerで管理
- ✅ 必要最小限の権限のみ付与
- ✅ 定期的にアクセスキーをローテーション
- ❌ 認証情報をコードに直接記述しない
- ❌ 認証情報をGitにコミットしない
- ❌ 認証情報を公開場所にアップロードしない

---

## 🔍 トラブルシューティング

### 認証情報が正しく設定されていない場合

```bash
# 現在の設定を確認
aws configure list

# 認証情報を再設定
aws configure

# 認証情報をテスト
aws sts get-caller-identity
```

### アクセスが拒否される場合

1. IAMユーザーに適切な権限が付与されているか確認
2. アクセスキーが有効か確認
3. リージョンが正しいか確認（`ap-northeast-1`）

### 複数のAWSアカウントを使用する場合

```bash
# プロファイルを作成
aws configure --profile production
aws configure --profile development

# プロファイルを指定して使用
aws s3 ls --profile production
```

---

## 📝 次のステップ

認証情報の設定が完了したら、[GET_STARTED.md](./GET_STARTED.md) の **Step 2** に進んでください。

