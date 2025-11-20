#!/bin/bash
# ECSサービスとALBの作成スクリプト
# 実行方法: bash scripts/setup-ecs-service.sh

set -e  # エラーが発生したら停止

echo "🚀 ECSサービスとALBの作成を開始します..."
echo ""

# 環境変数の確認
if [ -z "${VPC_ID}" ]; then
  echo "⚠️  VPC_IDが設定されていません。デフォルトVPCを使用します..."
  export VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)
fi

if [ -z "${SUBNET_IDS}" ]; then
  echo "⚠️  SUBNET_IDSが設定されていません。デフォルトVPCのサブネットを使用します..."
  export SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VPC_ID}" --query 'Subnets[*].SubnetId' --output text | tr '\t' ',')
fi

if [ -z "${SECURITY_GROUP_ID}" ]; then
  echo "⚠️  SECURITY_GROUP_IDが設定されていません。ECSセキュリティグループを検索します..."
  export SECURITY_GROUP_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=attendance-ecs-sg" "Name=vpc-id,Values=${VPC_ID}" --query 'SecurityGroups[0].GroupId' --output text)
fi

echo "使用するリソース:"
echo "VPC_ID: ${VPC_ID}"
echo "SUBNET_IDS: ${SUBNET_IDS}"
echo "SECURITY_GROUP_ID: ${SECURITY_GROUP_ID}"
echo ""

# 1. CloudWatch Logsグループの作成
echo "📦 Step 1: CloudWatch Logsグループの作成"
aws logs create-log-group \
  --log-group-name /ecs/attendance-backend \
  --region ap-northeast-1 2>/dev/null && \
  echo "✅ CloudWatch Logsグループを作成" || \
  echo "⚠️  CloudWatch Logsグループは既に存在します"
echo ""

# 2. ALB（Application Load Balancer）の作成
echo "📦 Step 2: ALBの作成"
ALB_NAME="attendance-alb"

# ALBが既に存在するか確認
EXISTING_ALB=$(aws elbv2 describe-load-balancers \
  --names ${ALB_NAME} \
  --region ap-northeast-1 \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text 2>/dev/null || echo "")

if [ -z "${EXISTING_ALB}" ] || [ "${EXISTING_ALB}" = "None" ]; then
  # サブネットIDを配列に変換
  IFS=',' read -ra SUBNET_ARRAY <<< "${SUBNET_IDS}"
  
  echo "ALBを作成中..."
  ALB_ARN=$(aws elbv2 create-load-balancer \
    --name ${ALB_NAME} \
    --subnets ${SUBNET_ARRAY[@]} \
    --security-groups ${SECURITY_GROUP_ID} \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4 \
    --region ap-northeast-1 \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text)
  
  echo "✅ ALBを作成: ${ALB_ARN}"
else
  ALB_ARN="${EXISTING_ALB}"
  echo "✅ 既存のALBを使用: ${ALB_ARN}"
fi

# ALBのDNS名を取得
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns ${ALB_ARN} \
  --region ap-northeast-1 \
  --query 'LoadBalancers[0].DNSName' \
  --output text)

echo "ALB DNS: ${ALB_DNS}"
echo ""

# 3. ターゲットグループの作成
echo "📦 Step 3: ターゲットグループの作成"
TG_NAME="attendance-tg"

EXISTING_TG=$(aws elbv2 describe-target-groups \
  --names ${TG_NAME} \
  --region ap-northeast-1 \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text 2>/dev/null || echo "")

if [ -z "${EXISTING_TG}" ] || [ "${EXISTING_TG}" = "None" ]; then
  TG_ARN=$(aws elbv2 create-target-group \
    --name ${TG_NAME} \
    --protocol HTTP \
    --port 80 \
    --vpc-id ${VPC_ID} \
    --target-type ip \
    --health-check-path /api/health \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 5 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3 \
    --region ap-northeast-1 \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text)
  
  echo "✅ ターゲットグループを作成: ${TG_ARN}"
else
  TG_ARN="${EXISTING_TG}"
  echo "✅ 既存のターゲットグループを使用: ${TG_ARN}"
fi
echo ""

# 4. リスナーの作成
echo "📦 Step 4: リスナーの作成"
LISTENER_EXISTS=$(aws elbv2 describe-listeners \
  --load-balancer-arn ${ALB_ARN} \
  --region ap-northeast-1 \
  --query 'Listeners[0].ListenerArn' \
  --output text 2>/dev/null || echo "")

if [ -z "${LISTENER_EXISTS}" ] || [ "${LISTENER_EXISTS}" = "None" ]; then
  aws elbv2 create-listener \
    --load-balancer-arn ${ALB_ARN} \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=${TG_ARN} \
    --region ap-northeast-1
  
  echo "✅ リスナーを作成"
else
  echo "✅ 既存のリスナーを使用"
fi
echo ""

# 5. ECSサービスの作成
echo "📦 Step 5: ECSサービスの作成"
SERVICE_NAME="attendance-api-service"
CLUSTER_NAME="attendance-cluster"

# タスク定義の最新版を取得
TASK_DEFINITION=$(aws ecs list-task-definitions \
  --family-prefix attendance-backend-task \
  --sort DESC \
  --max-items 1 \
  --region ap-northeast-1 \
  --query 'taskDefinitionArns[0]' \
  --output text 2>/dev/null || echo "")

if [ -z "${TASK_DEFINITION}" ] || [ "${TASK_DEFINITION}" = "None" ]; then
  echo "⚠️  タスク定義が見つかりません。まずタスク定義を登録する必要があります。"
  echo "GitHub Actionsのデプロイを実行してタスク定義を作成してください。"
  exit 1
fi

# サービスが既に存在するか確認
EXISTING_SERVICE=$(aws ecs describe-services \
  --cluster ${CLUSTER_NAME} \
  --services ${SERVICE_NAME} \
  --region ap-northeast-1 \
  --query 'services[0].serviceName' \
  --output text 2>/dev/null || echo "")

if [ -z "${EXISTING_SERVICE}" ] || [ "${EXISTING_SERVICE}" = "None" ]; then
  echo "ECSサービスを作成中..."
  
  # サブネットIDを配列に変換
  IFS=',' read -ra SUBNET_ARRAY <<< "${SUBNET_IDS}"
  
  aws ecs create-service \
    --cluster ${CLUSTER_NAME} \
    --service-name ${SERVICE_NAME} \
    --task-definition ${TASK_DEFINITION} \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[${SUBNET_ARRAY[@]}],securityGroups=[${SECURITY_GROUP_ID}],assignPublicIp=ENABLED}" \
    --load-balancers targetGroupArn=${TG_ARN},containerName=laravel-api,containerPort=80 \
    --region ap-northeast-1
  
  echo "✅ ECSサービスを作成: ${SERVICE_NAME}"
else
  echo "✅ 既存のECSサービスを使用: ${SERVICE_NAME}"
fi
echo ""

# 6. 結果の表示
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ECSサービスとALBの作成が完了しました！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 以下の値をメモしてください:"
echo ""
echo "ALB_DNS: ${ALB_DNS}"
echo "ALB_ARN: ${ALB_ARN}"
echo "TARGET_GROUP_ARN: ${TG_ARN}"
echo ""
echo "⚠️  重要: GitHub Secretsに以下を追加してください:"
echo "  API_URL: http://${ALB_DNS}"
echo "  REACT_APP_API_URL: http://${ALB_DNS}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

