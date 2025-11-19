# セットアップスクリプト

このディレクトリには、AWSインフラのセットアップを自動化するスクリプトが含まれています。

## 📋 スクリプト一覧

### 1. `setup-network.sh` - ネットワーク基盤の構築

VPC、サブネット、セキュリティグループを作成します。

**実行方法:**
```bash
bash scripts/setup-network.sh
```

**作成されるリソース:**
- VPC
- インターネットゲートウェイ
- パブリックサブネット（2つ）
- プライベートサブネット（2つ）
- ルートテーブル
- セキュリティグループ（ECS用、RDS用）

### 2. `setup-aws-resources.sh` - AWSリソースの作成

ECR、ECS、S3バケットを作成します。

**実行方法:**
```bash
bash scripts/setup-aws-resources.sh
```

**作成されるリソース:**
- ECRリポジトリ（attendance-backend）
- ECSクラスター（attendance-cluster）
- S3バケット（attendance-frontend-{account-id}-{timestamp}）

### 3. `setup-all.sh` - すべてを一括実行

上記2つのスクリプトを順番に実行します。

**実行方法:**
```bash
bash scripts/setup-all.sh
```

## 🚀 クイックスタート

### 方法1: すべてを一括実行（推奨）

```bash
bash scripts/setup-all.sh
```

### 方法2: 個別に実行

```bash
# 1. ネットワーク基盤
bash scripts/setup-network.sh

# 2. AWSリソース
bash scripts/setup-aws-resources.sh
```

## ⚠️ 注意事項

1. **AWS認証情報が設定されていること**
   ```bash
   aws sts get-caller-identity
   ```

2. **既存のリソースがある場合**
   - スクリプトは既存のリソースを検出して、再利用します
   - エラーが出ても、既に存在する場合は問題ありません

3. **変数の保持**
   - スクリプト内で`export`を使用しているため、同じシェルセッション内で変数が保持されます
   - 新しいターミナルを開いた場合は、変数を再設定する必要があります

## 📝 出力される値

各スクリプト実行後、以下の値が表示されます。これらをメモしてください：

- `VPC_ID`
- `SUBNET_IDS`（カンマ区切り）
- `SECURITY_GROUP_ID`
- `S3_BUCKET_FRONTEND`
- `ECR_URI`

これらの値は、GitHub Secretsやワークフローファイルの設定で使用します。

## 🔄 再実行

スクリプトは何度でも実行できます。既存のリソースがある場合は、それを使用します。

## 🆘 トラブルシューティング

### エラー: 権限が不足している

IAMポリシーに必要な権限が含まれているか確認：
- EC2権限（VPC、サブネット、セキュリティグループ）
- ECR権限
- ECS権限
- S3権限

### エラー: リソースが既に存在する

既存のリソースを使用するため、問題ありません。スクリプトは自動的に既存リソースを検出します。

### 変数が失われた

新しいターミナルを開いた場合、変数を再設定：

```bash
# ネットワーク変数を再設定
bash scripts/setup-network.sh

# または、手動で設定
export VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)
```

---

**詳細:** [GET_STARTED.md](../docs/infrastructure/GET_STARTED.md)

