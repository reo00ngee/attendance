# AWS Infrastructure & CI/CD Documentation

## 📚 ドキュメント一覧

このディレクトリには以下のドキュメントがあります：

1. **[AWS_ACCOUNT_SETUP.md](./AWS_ACCOUNT_SETUP.md)** - 🆕 **新しいAWSアカウントのセットアップ（初めての場合）**
   - AWSアカウント作成からIAMユーザー設定まで
   - 請求アラートの設定方法

2. **[GET_STARTED.md](./GET_STARTED.md)** - 🚀 **今すぐ始める手順書（これから読む）**
   - 実際にデプロイを開始するための手順
   - 5ステップでデプロイ開始可能

3. **[HOW_IT_WORKS.md](./HOW_IT_WORKS.md)** - 🔄 CI/CDパイプラインの仕組み
   - パイプラインがどう動くかの説明
   - 概念理解用

4. **このREADME.md** - 📖 全体概要とインフラ設計
   - アーキテクチャの詳細
   - 使用サービスとコスト見積もり

---

## 概要

このドキュメントは、Attendance Management SystemのAWSインフラ構成とCI/CDパイプラインの設計・実装ガイドです。

## インフラ構成

### アーキテクチャ概要

```
Internet Users
    ↓
CloudFront (CDN + HTTPS)
    ↓
    ├─→ S3 Bucket (Frontend - React SPA)
    └─→ Application Load Balancer (ALB)
            ↓
        ECS Fargate (Laravel API)
            ↓
    ┌───────┴───────┐
    ↓               ↓
RDS MySQL      ElastiCache Redis
```

### 使用AWSサービス

1. **CloudFront** - CDN配信、HTTPS終端
2. **S3** - フロントエンド静的ファイル、ストレージ
3. **Application Load Balancer (ALB)** - リクエスト分散、SSL/TLS終端
4. **ECS Fargate** - コンテナ実行（Laravel API）
5. **RDS MySQL** - マネージドデータベース
6. **ElastiCache Redis** - セッション/キャッシュ
7. **Secrets Manager** - 環境変数・シークレット管理
8. **CloudWatch** - ログ・メトリクス

### 初期コスト見積もり

約 **$53/月**（初期構成）

## CI/CDパイプライン

### GitHub Actions ワークフロー

`main`ブランチへのマージ時に自動実行されるパイプライン：

1. **Backend Test** - PHPUnitテスト、Laravel Pint（リンティング）
2. **Frontend Test** - ESLint、Jestテスト、ビルド
3. **Backend Build** - DockerイメージをビルドしてECRにプッシュ
4. **Frontend Deploy** - S3にデプロイ、CloudFrontキャッシュ無効化
5. **Backend Deploy** - ECS Fargateにデプロイ
6. **Health Check** - デプロイ後のヘルスチェック

### 必要なGitHub Secrets

以下のSecretsをGitHubリポジトリに設定してください：

```
AWS_ACCESS_KEY_ID          # AWSアクセスキーID
AWS_SECRET_ACCESS_KEY      # AWSシークレットアクセスキー
REACT_APP_API_URL          # フロントエンド用API URL
API_URL                    # バックエンドAPI URL（ヘルスチェック用）
FRONTEND_URL               # フロントエンドURL（ヘルスチェック用）
```

### 必要な環境変数

`.github/workflows/deploy.yml`の`env`セクションを更新：

```yaml
env:
  AWS_REGION: ap-northeast-1
  ECR_REPOSITORY: attendance-backend
  ECS_SERVICE: attendance-api-service
  ECS_CLUSTER: attendance-cluster
  ECS_TASK_DEFINITION: attendance-backend-task
  S3_BUCKET_FRONTEND: attendance-frontend-bucket
  CLOUDFRONT_DISTRIBUTION_ID: YOUR_CLOUDFRONT_DIST_ID
```

## セットアップ手順

### 1. AWSリソースの作成

#### ECRリポジトリの作成
```bash
aws ecr create-repository --repository-name attendance-backend --region ap-northeast-1
```

#### ECSクラスターの作成
```bash
aws ecs create-cluster --cluster-name attendance-cluster --region ap-northeast-1
```

#### RDS MySQLの作成
```bash
aws rds create-db-instance \
  --db-instance-identifier attendance-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0 \
  --master-username admin \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20 \
  --region ap-northeast-1
```

#### ElastiCache Redisの作成
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id attendance-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --region ap-northeast-1
```

#### S3バケットの作成
```bash
aws s3 mb s3://attendance-frontend-bucket --region ap-northeast-1
aws s3 website s3://attendance-frontend-bucket --index-document index.html --error-document index.html
```

#### CloudFrontディストリビューションの作成
AWSコンソールまたはCLIで作成し、S3バケットをオリジンとして設定

### 2. Secrets Managerの設定

以下のシークレットをAWS Secrets Managerに作成：

```bash
aws secretsmanager create-secret \
  --name attendance/app-key \
  --secret-string "YOUR_LARAVEL_APP_KEY" \
  --region ap-northeast-1

aws secretsmanager create-secret \
  --name attendance/db-host \
  --secret-string "YOUR_RDS_ENDPOINT" \
  --region ap-northeast-1

# 同様に他のシークレットも作成
```

### 3. IAMロールの作成

#### ECS Task Execution Role
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "*"
    }
  ]
}
```

#### ECS Task Role
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::attendance-storage-bucket/*"
    }
  ]
}
```

### 4. ECSタスク定義の更新

`.github/aws/task-definition.json`を編集：

- `YOUR_ACCOUNT_ID`を実際のAWSアカウントIDに置換
- Secrets ManagerのARNを実際の値に更新

### 5. GitHub Secretsの設定

GitHubリポジトリの Settings → Secrets and variables → Actions で以下を設定：

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `REACT_APP_API_URL`
- `API_URL`
- `FRONTEND_URL`

## デプロイフロー

### 自動デプロイ

1. `main`ブランチにPull Requestをマージ
2. GitHub Actionsが自動的に実行される
3. テスト → ビルド → デプロイの順で実行
4. デプロイ完了後、ヘルスチェックが実行される

### 手動デプロイ

GitHub Actionsのワークフローを手動実行：

1. GitHubリポジトリの Actions タブを開く
2. "Deploy to AWS" ワークフローを選択
3. "Run workflow" をクリック

## ロールバック戦略

### 方法1: ECSサービスの前のタスク定義に戻す

```bash
# 前のタスク定義を取得
PREVIOUS_TASK_DEF=$(aws ecs describe-services \
  --cluster attendance-cluster \
  --services attendance-api-service \
  --query 'services[0].deployments[?status==`PRIMARY`].taskDefinition' \
  --output text)

# 前のタスク定義に更新
aws ecs update-service \
  --cluster attendance-cluster \
  --service attendance-api-service \
  --task-definition $PREVIOUS_TASK_DEF \
  --force-new-deployment
```

### 方法2: GitHub Actionsでロールバックワークフローを作成

`.github/workflows/rollback.yml`を作成し、特定のコミットハッシュのイメージにロールバック

### 方法3: CloudFrontキャッシュの無効化（フロントエンド）

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## モニタリング

### CloudWatchメトリクス

- ECS: CPU使用率、メモリ使用率
- RDS: CPU使用率、接続数、ストレージ使用量
- ALB: リクエスト数、エラー率、レイテンシー

### CloudWatchログ

- ECSタスクログ: `/ecs/attendance-backend`
- Nginxアクセスログ: ECSタスク内の`/var/log/nginx/access.log`
- Laravelログ: ECSタスク内の`/var/www/html/storage/logs/laravel.log`

## トラブルシューティング

### デプロイが失敗する場合

1. GitHub Actionsのログを確認
2. ECSサービスのイベントを確認
3. CloudWatchログを確認
4. タスク定義の設定を確認

### アプリケーションが起動しない場合

1. ECSタスクのログを確認
2. ヘルスチェックの設定を確認
3. Secrets Managerの値が正しいか確認
4. セキュリティグループの設定を確認

## コスト最適化

### ポートフォリオ用途の場合

就活が終了したら、以下のリソースを停止してコストを削減：

1. ECSサービスのスケールを0に設定
2. RDSインスタンスを停止
3. ElastiCacheクラスターを削除
4. ALBを削除（必要に応じて）

### リソース停止コマンド

```bash
# ECSサービスをスケールダウン
aws ecs update-service \
  --cluster attendance-cluster \
  --service attendance-api-service \
  --desired-count 0

# RDSインスタンスを停止
aws rds stop-db-instance --db-instance-identifier attendance-db
```

## セキュリティベストプラクティス

1. **最小権限の原則**: IAMロールは必要最小限の権限のみ
2. **シークレット管理**: すべての機密情報はSecrets Managerに保存
3. **ネットワーク分離**: VPC内にリソースを配置、セキュリティグループでアクセス制御
4. **HTTPS強制**: CloudFrontとALBでHTTPSを強制
5. **ログ監視**: CloudWatchで異常を検知

## 参考リンク

- [AWS ECS Fargate ドキュメント](https://docs.aws.amazon.com/ecs/latest/developerguide/AWS_Fargate.html)
- [GitHub Actions ドキュメント](https://docs.github.com/en/actions)
- [Laravel デプロイメントガイド](https://laravel.com/docs/deployment)
