# デプロイチェックリスト

## ✅ 完了した項目

- [x] AWS CLIのインストールと設定
- [x] ネットワーク基盤の構築（VPC、サブネット、セキュリティグループ）
- [x] IAMポリシーの更新
- [x] ECRリポジトリの作成
- [x] ECSクラスターの作成
- [x] S3バケットの作成とパブリックアクセス設定
- [x] ワークフローファイルの更新（S3_BUCKET_FRONTEND）
- [x] GitHub Secretsの設定

## 📋 次のステップ

### 1. 変更をコミットしてプッシュ

```bash
# 現在のブランチを確認
git branch

# devブランチの場合、mainブランチにマージ
git checkout main
git merge dev
git push origin main

# または、直接mainブランチに切り替えてプッシュ
git checkout main
git add .
git commit -m "Add CI/CD pipeline and AWS infrastructure setup"
git push origin main
```

### 2. GitHub Actionsの実行を確認

1. GitHubリポジトリ → **Actions** タブを開く
2. **Deploy to AWS** ワークフローが実行されているか確認
3. 各ジョブの実行状況を確認：
   - ✅ Backend - Test & Lint
   - ✅ Frontend - Test & Build
   - ✅ Backend - Build & Push to ECR
   - ✅ Frontend - Deploy to S3
   - ✅ Backend - Deploy to ECS
   - ✅ Health Check

### 3. エラーが発生した場合

- **権限エラー**: IAMポリシーに必要な権限が追加されているか確認
- **リソースが見つからない**: AWSリソースが正しく作成されているか確認
- **ビルドエラー**: ログを確認して、コードの問題を修正

## 🔄 デプロイ後の確認

デプロイが成功したら：

1. **ECSサービス**が起動しているか確認
2. **S3バケット**にフロントエンドがデプロイされているか確認
3. **ALB**のDNS名を確認（まだ作成していない場合は、次のステップで作成）

## 📝 現在の設定値

- **ECR URI**: `158259501930.dkr.ecr.ap-northeast-1.amazonaws.com/attendance-backend`
- **S3 Bucket**: `attendance-frontend-158259501930-1763565548`
- **VPC ID**: `vpc-08f1650afa45efb02`
- **Subnet IDs**: `subnet-0b2f1ff088671f7df,subnet-03ca53640de79ade0`
- **Security Group ID**: `sg-09e2841dce32a4347`

---

**次のステップ:** RDS MySQLとElastiCache Redisの作成（デプロイが成功したら）

