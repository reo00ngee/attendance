#!/bin/bash
# AWSリソース（ECR、ECS、S3）の作成スクリプト
# 実行方法: bash scripts/setup-aws-resources.sh

set -e  # エラーが発生したら停止

echo "🚀 AWSリソースの作成を開始します..."
echo ""

# 1. ECRリポジトリの作成
echo "📦 Step 1: ECRリポジトリの作成"
aws ecr create-repository \
  --repository-name attendance-backend \
  --region ap-northeast-1 \
  --image-scanning-configuration scanOnPush=true 2>/dev/null && \
  echo "✅ ECRリポジトリを作成: attendance-backend" || \
  echo "⚠️  ECRリポジトリは既に存在します"

# ECRリポジトリURIを取得
ECR_URI=$(aws ecr describe-repositories \
  --repository-names attendance-backend \
  --region ap-northeast-1 \
  --query 'repositories[0].repositoryUri' \
  --output text)

echo "ECR URI: ${ECR_URI}"
echo ""

# 2. ECSクラスターの作成
echo "📦 Step 2: ECSクラスターの作成"
aws ecs create-cluster \
  --cluster-name attendance-cluster \
  --region ap-northeast-1 2>/dev/null && \
  echo "✅ ECSクラスターを作成: attendance-cluster" || \
  echo "⚠️  ECSクラスターは既に存在します"
echo ""

# 3. S3バケットの作成
echo "📦 Step 3: S3バケットの作成"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
TIMESTAMP=$(date +%s)
BUCKET_NAME="attendance-frontend-${AWS_ACCOUNT_ID}-${TIMESTAMP}"

echo "作成するS3バケット名: ${BUCKET_NAME}"

# バケット作成
aws s3 mb s3://${BUCKET_NAME} --region ap-northeast-1 2>/dev/null && \
  echo "✅ S3バケットを作成: ${BUCKET_NAME}" || \
  echo "⚠️  バケット名が既に使用されています。別の名前を試します..."

if [ $? -ne 0 ]; then
  RANDOM_SUFFIX=$(openssl rand -hex 4)
  BUCKET_NAME="attendance-frontend-${AWS_ACCOUNT_ID}-${TIMESTAMP}-${RANDOM_SUFFIX}"
  aws s3 mb s3://${BUCKET_NAME} --region ap-northeast-1
  echo "✅ S3バケットを作成（新しい名前）: ${BUCKET_NAME}"
fi

# Block Public Accessを無効化（静的ウェブサイトホスティングに必要）
echo "📦 Block Public Accessを無効化中..."
aws s3api put-public-access-block \
  --bucket ${BUCKET_NAME} \
  --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" 2>/dev/null && \
  echo "✅ Block Public Accessを無効化" || \
  echo "⚠️  Block Public Accessの設定に失敗（既に設定済みの可能性があります）"

# 静的ウェブサイトホスティング設定
aws s3 website s3://${BUCKET_NAME} \
  --index-document index.html \
  --error-document index.html

echo "✅ 静的ウェブサイトホスティングを設定"

# パブリックアクセス設定
echo "📦 パブリックアクセスポリシーを設定中..."
aws s3api put-bucket-policy \
  --bucket ${BUCKET_NAME} \
  --policy "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [{
      \"Sid\": \"PublicReadGetObject\",
      \"Effect\": \"Allow\",
      \"Principal\": \"*\",
      \"Action\": \"s3:GetObject\",
      \"Resource\": \"arn:aws:s3:::${BUCKET_NAME}/*\"
    }]
  }" 2>/dev/null && \
  echo "✅ パブリックアクセスポリシーを設定" || \
  echo "⚠️  パブリックアクセスポリシーの設定に失敗（Block Public Accessが有効な可能性があります）"
echo ""

# 4. 結果の表示
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ AWSリソースの作成が完了しました！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 以下の値をメモしてください:"
echo ""
echo "ECR_URI: ${ECR_URI}"
echo "S3_BUCKET_FRONTEND: ${BUCKET_NAME}"
echo ""
echo "⚠️  重要: .github/workflows/deploy.yml の以下を更新してください:"
echo "  S3_BUCKET_FRONTEND: ${BUCKET_NAME}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "次のステップ: GitHub Secretsを設定してください"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

