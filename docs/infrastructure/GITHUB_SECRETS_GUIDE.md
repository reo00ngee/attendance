# GitHub Secrets設定ガイド

## 📋 設定が必要なSecrets一覧

以下のSecretsをGitHubリポジトリに設定してください。

### 設定手順

1. GitHubリポジトリを開く
2. **Settings** → **Secrets and variables** → **Actions** を開く
3. **New repository secret** をクリック
4. 以下の表の各Secretを追加

---

## 🔑 Secrets一覧

| Name | Value | 説明 |
|------|-------|------|
| `AWS_ACCESS_KEY_ID` | `AKIA...` | AWSアクセスキーID（Step 0.3で作成） |
| `AWS_SECRET_ACCESS_KEY` | `...` | AWSシークレットアクセスキー（Step 0.3で作成） |
| `VPC_ID` | `vpc-08f1650afa45efb02` | VPC ID |
| `SUBNET_IDS` | `subnet-0b2f1ff088671f7df,subnet-03ca53640de79ade0` | パブリックサブネットID（カンマ区切り） |
| `SECURITY_GROUP_ID` | `sg-09e2841dce32a4347` | ECS用セキュリティグループID |
| `REACT_APP_API_URL` | `https://api.yourdomain.com` | フロントエンド用API URL（後で更新） |
| `API_URL` | `https://api.yourdomain.com` | バックエンド用API URL（後で更新） |
| `FRONTEND_URL` | `https://yourdomain.com` | フロントエンドURL（後で更新） |

---

## 📝 現在の設定値

### AWS認証情報
- **AWS_ACCESS_KEY_ID**: Step 0.3でダウンロードしたCSVファイルから取得
- **AWS_SECRET_ACCESS_KEY**: Step 0.3でダウンロードしたCSVファイルから取得

### ネットワーク設定
- **VPC_ID**: `vpc-08f1650afa45efb02`
- **SUBNET_IDS**: `subnet-0b2f1ff088671f7df,subnet-03ca53640de79ade0`
- **SECURITY_GROUP_ID**: `sg-09e2841dce32a4347`

### URL設定（後で更新）
- **REACT_APP_API_URL**: ALBのDNS名が確定したら更新
- **API_URL**: ALBのDNS名が確定したら更新
- **FRONTEND_URL**: CloudFrontのURLが確定したら更新

---

## ⚠️ 注意事項

1. **AWS認証情報の管理**
   - Secretsは暗号化されて保存されます
   - 一度設定すると、値は表示できません（再設定が必要）
   - 紛失した場合は、新しいアクセスキーを作成してください

2. **URL設定について**
   - 初回デプロイ時は、ALBやCloudFrontのURLがまだ確定していません
   - 一時的に `https://api.yourdomain.com` や `https://yourdomain.com` を設定
   - デプロイ後に実際のURLを確認して更新してください

3. **SUBNET_IDSの形式**
   - カンマ区切りで、スペースは入れない
   - 例: `subnet-xxx,subnet-yyy` ✅
   - 例: `subnet-xxx, subnet-yyy` ❌（スペースが入っている）

---

## ✅ 確認

すべてのSecretsを設定したら、以下を確認：

- [ ] 8つのSecretsが追加されている
- [ ] 値に誤字がないか確認
- [ ] SUBNET_IDSにスペースが入っていないか確認

---

## 🔄 次のステップ

Secrets設定完了後：

1. ワークフローファイルの確認（`.github/workflows/deploy.yml`）
2. 初回デプロイの実行（mainブランチにプッシュ）

---

**参考:** [GET_STARTED.md](./GET_STARTED.md) の Step 3

