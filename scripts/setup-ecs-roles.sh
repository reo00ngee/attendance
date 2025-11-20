#!/bin/bash
# ECSタスク実行ロールとタスクロールの作成スクリプト
# 実行方法: bash scripts/setup-ecs-roles.sh

set -e  # エラーが発生したら停止

echo "🚀 ECSロールの作成を開始します..."
echo ""

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "AWSアカウントID: ${AWS_ACCOUNT_ID}"
echo ""

# 1. ECSタスク実行ロールの作成
echo "📦 Step 1: ECSタスク実行ロールの作成"
EXECUTION_ROLE_NAME="ecsTaskExecutionRole"

# ロールが既に存在するか確認
if aws iam get-role --role-name ${EXECUTION_ROLE_NAME} 2>/dev/null; then
  echo "✅ ECSタスク実行ロールは既に存在します: ${EXECUTION_ROLE_NAME}"
else
  echo "ECSタスク実行ロールを作成中..."
  
  # 信頼ポリシーJSONを作成
  cat > /tmp/ecs-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

  # ロールを作成
  aws iam create-role \
    --role-name ${EXECUTION_ROLE_NAME} \
    --assume-role-policy-document file:///tmp/ecs-trust-policy.json

  # AWS管理ポリシーをアタッチ
  aws iam attach-role-policy \
    --role-name ${EXECUTION_ROLE_NAME} \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

  echo "✅ ECSタスク実行ロールを作成: ${EXECUTION_ROLE_NAME}"
fi

EXECUTION_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/${EXECUTION_ROLE_NAME}"
echo "Execution Role ARN: ${EXECUTION_ROLE_ARN}"
echo ""

# 2. ECSタスクロールの作成（アプリケーション用）
echo "📦 Step 2: ECSタスクロールの作成"
TASK_ROLE_NAME="ecsTaskRole"

# ロールが既に存在するか確認
if aws iam get-role --role-name ${TASK_ROLE_NAME} 2>/dev/null; then
  echo "✅ ECSタスクロールは既に存在します: ${TASK_ROLE_NAME}"
else
  echo "ECSタスクロールを作成中..."
  
  # 信頼ポリシーJSONを作成
  cat > /tmp/ecs-task-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

  # ロールを作成
  aws iam create-role \
    --role-name ${TASK_ROLE_NAME} \
    --assume-role-policy-document file:///tmp/ecs-task-trust-policy.json

  # 最小限のポリシーをアタッチ（必要に応じて拡張）
  cat > /tmp/ecs-task-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
EOF

  aws iam put-role-policy \
    --role-name ${TASK_ROLE_NAME} \
    --policy-name ECSBasicPolicy \
    --policy-document file:///tmp/ecs-task-policy.json

  echo "✅ ECSタスクロールを作成: ${TASK_ROLE_NAME}"
fi

TASK_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/${TASK_ROLE_NAME}"
echo "Task Role ARN: ${TASK_ROLE_ARN}"
echo ""

# 3. 結果の表示
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ECSロールの作成が完了しました！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 以下の値をメモしてください:"
echo ""
echo "EXECUTION_ROLE_ARN: ${EXECUTION_ROLE_ARN}"
echo "TASK_ROLE_ARN: ${TASK_ROLE_ARN}"
echo ""
echo "⚠️  重要: .github/aws/task-definition.json の以下を更新してください:"
echo "  executionRoleArn: ${EXECUTION_ROLE_ARN}"
echo "  taskRoleArn: ${TASK_ROLE_ARN}"
echo "  YOUR_ACCOUNT_ID を ${AWS_ACCOUNT_ID} に置き換え"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

