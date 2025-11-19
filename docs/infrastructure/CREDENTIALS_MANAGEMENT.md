# AWS認証情報の管理方法

## 🔐 認証情報を安全に管理する方法

### 方法1: パスワードマネージャーを使用（推奨）

#### 推奨ツール

1. **1Password**（有料、高機能）
   - セキュアノート機能で認証情報を保存
   - 自動入力機能あり

2. **Bitwarden**（無料版あり）
   - オープンソース
   - セキュアノート機能あり

3. **LastPass**（無料版あり）
   - ブラウザ拡張機能あり

#### 保存する情報

パスワードマネージャーに以下の情報を保存：

```
項目名: AWS IAM User - attendance-deploy-user
Access Key ID: AKIAIOSFODNN7EXAMPLE
Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Region: ap-northeast-1
アカウント作成日: 2025-01-XX
```

**メリット:**
- ✅ 暗号化されて安全
- ✅ 複数デバイスで同期可能
- ✅ 紛失のリスクが低い
- ✅ 自動入力機能で便利

---

### 方法2: 暗号化されたファイルとして保存

#### ローカルに暗号化して保存

```bash
# 1. 認証情報をテキストファイルに保存（一時的）
cat > ~/aws-credentials-temp.txt <<EOF
Access Key ID: AKIAIOSFODNN7EXAMPLE
Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Region: ap-northeast-1
EOF

# 2. GPGで暗号化
gpg -c ~/aws-credentials-temp.txt

# 3. 元のファイルを削除（暗号化されたファイルのみ残す）
rm ~/aws-credentials-temp.txt

# 4. 暗号化されたファイルを安全な場所に移動
mv ~/aws-credentials-temp.txt.gpg ~/Documents/aws-credentials.gpg

# 5. 復号化する場合
gpg -d ~/Documents/aws-credentials.gpg
```

**メリット:**
- ✅ 無料
- ✅ ローカルで完結
- ✅ 暗号化されている

**デメリット:**
- ❌ 復号化パスワードを忘れるとアクセス不可
- ❌ バックアップが必要

---

### 方法3: クラウドストレージに暗号化して保存

#### Google Drive / Dropbox / OneDrive

1. 認証情報をテキストファイルに保存
2. 7-ZipやWinRARでパスワード保護してZIP化
3. クラウドストレージにアップロード
4. 元のファイルを削除

```bash
# 例: 7-Zipでパスワード保護
7z a -p aws-credentials.7z aws-credentials.txt
```

**メリット:**
- ✅ バックアップとして機能
- ✅ 複数デバイスからアクセス可能

**デメリット:**
- ❌ クラウドストレージのセキュリティに依存
- ❌ パスワードを忘れるとアクセス不可

---

### 方法4: AWS Secrets Managerに保存（上級者向け）

既にAWSにアクセスできる場合、Secrets Managerに保存：

```bash
# 認証情報をSecrets Managerに保存
aws secretsmanager create-secret \
  --name personal/aws-credentials \
  --secret-string '{"access_key_id":"AKIAIOSFODNN7EXAMPLE","secret_access_key":"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"}' \
  --region ap-northeast-1

# 取得する場合
aws secretsmanager get-secret-value \
  --secret-id personal/aws-credentials \
  --region ap-northeast-1
```

**メリット:**
- ✅ AWSのセキュリティ機能を利用
- ✅ アクセスログが記録される

**デメリット:**
- ❌ 既にAWSにアクセスできる必要がある
- ❌ やや複雑

---

## 📋 推奨される管理フロー

### 初回セットアップ時

1. **CSVファイルをダウンロード**
   - ブラウザのダウンロードフォルダに保存

2. **パスワードマネージャーに登録**
   - Access Key ID
   - Secret Access Key
   - その他の情報（リージョン、作成日など）

3. **aws configureで設定**
   ```bash
   aws configure
   ```

4. **動作確認**
   ```bash
   aws sts get-caller-identity
   ```

5. **CSVファイルを削除または安全な場所に移動**
   - パスワードマネージャーに保存済みなら削除してもOK
   - 念のため、暗号化してバックアップを取る

### 日常的な使用

- 認証情報は`~/.aws/credentials`に保存されている
- 通常は`aws configure`で設定した情報を使用
- パスワードマネージャーはバックアップとして保管

### 認証情報を紛失した場合

1. **IAMコンソールにログイン**
   - ルートアカウントまたは別のIAMユーザーでログイン

2. **古いアクセスキーを削除**
   - IAM → ユーザー → セキュリティ認証情報
   - 古いアクセスキーを削除

3. **新しいアクセスキーを作成**
   - 「アクセスキーを作成」をクリック
   - 新しいキーをダウンロード

4. **aws configureで再設定**
   ```bash
   aws configure
   ```

---

## ⚠️ 絶対にやってはいけないこと

### ❌ Gitリポジトリにコミット

```bash
# .gitignoreに追加（必須）
echo "*.csv" >> .gitignore
echo ".aws/" >> .gitignore
echo "*credentials*" >> .gitignore
echo "*secret*" >> .gitignore
```

### ❌ コードに直接記述

```bash
# 悪い例（絶対にやらない）
export AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
export AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
```

### ❌ 公開場所にアップロード

- GitHub、GitLabなどの公開リポジトリ
- Slack、Discordなどのチャットツール
- メールで送信

### ❌ スクリーンショットで保存

- スクリーンショットは削除されにくい
- クラウドに自動バックアップされる可能性がある

---

## 🔄 認証情報のローテーション（定期的な更新）

セキュリティのベストプラクティスとして、定期的に認証情報を更新：

### 推奨頻度

- **3-6ヶ月ごと**にローテーション
- または、漏洩の疑いがある場合

### ローテーション手順

1. **新しいアクセスキーを作成**
   ```bash
   # IAMコンソールで新しいキーを作成
   ```

2. **新しいキーでaws configureを実行**
   ```bash
   aws configure
   ```

3. **動作確認**
   ```bash
   aws sts get-caller-identity
   ```

4. **古いキーを削除**
   - IAMコンソールで古いキーを削除

5. **パスワードマネージャーを更新**
   - 新しい認証情報で更新

---

## 📝 チェックリスト

認証情報を安全に管理できているか確認：

- [ ] パスワードマネージャーに保存している
- [ ] CSVファイルは削除または暗号化して保存
- [ ] `.gitignore`に認証情報関連のファイルを追加
- [ ] コードに認証情報を直接記述していない
- [ ] 公開場所にアップロードしていない
- [ ] バックアップを取っている
- [ ] 定期的なローテーション計画がある

---

## 🆘 認証情報を紛失した場合の対処法

### すぐにやること

1. **IAMコンソールにログイン**
   - ルートアカウントまたは別のIAMユーザーで

2. **古いアクセスキーを無効化**
   - IAM → ユーザー → セキュリティ認証情報
   - 古いキーを削除

3. **新しいアクセスキーを作成**
   - 新しいキーをダウンロード
   - パスワードマネージャーに保存

4. **aws configureで再設定**
   ```bash
   aws configure
   ```

### 予防策

- パスワードマネージャーを使用
- 複数のバックアップを取る
- 定期的にローテーション

---

**💡 推奨:** パスワードマネージャー（Bitwarden無料版など）を使用するのが最も安全で簡単です。

