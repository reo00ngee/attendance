#!/bin/bash
# ネットワーク基盤の構築スクリプト
# 実行方法: bash scripts/setup-network.sh

set -e  # エラーが発生したら停止

echo "🚀 ネットワーク基盤の構築を開始します..."
echo ""

# 1. VPCの作成（または既存のVPCを使用）
echo "📦 Step 1: VPCの確認・作成"
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=attendance-vpc}]' \
  --region ap-northeast-1 \
  --query Vpc.VpcId \
  --output text 2>/dev/null || \
  aws ec2 describe-vpcs \
    --filters "Name=cidr-block,Values=10.0.0.0/16" \
    --query 'Vpcs[0].VpcId' \
    --output text)

if [ -z "${VPC_ID}" ] || [ "${VPC_ID}" = "None" ]; then
  echo "10.0.0.0/16のVPCが見つかりません。デフォルトVPCを使用します..."
  VPC_ID=$(aws ec2 describe-vpcs \
    --filters "Name=isDefault,Values=true" \
    --query 'Vpcs[0].VpcId' \
    --output text)
  echo "✅ デフォルトVPCを使用: ${VPC_ID}"
else
  echo "✅ VPC ID: ${VPC_ID}"
fi

export VPC_ID

# 2. インターネットゲートウェイの作成とアタッチ
echo ""
echo "📦 Step 2: インターネットゲートウェイの設定"
IGW_ID=$(aws ec2 describe-internet-gateways \
  --filters "Name=attachment.vpc-id,Values=${VPC_ID}" \
  --query 'InternetGateways[0].InternetGatewayId' \
  --output text)

if [ -z "${IGW_ID}" ] || [ "${IGW_ID}" = "None" ]; then
  IGW_ID=$(aws ec2 create-internet-gateway \
    --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=attendance-igw}]' \
    --query InternetGateway.InternetGatewayId \
    --output text)
  
  aws ec2 attach-internet-gateway \
    --vpc-id "${VPC_ID}" \
    --internet-gateway-id "${IGW_ID}"
  echo "✅ インターネットゲートウェイを作成・アタッチ: ${IGW_ID}"
else
  echo "✅ 既存のインターネットゲートウェイを使用: ${IGW_ID}"
fi

export IGW_ID

# 3. パブリックサブネットの作成
echo ""
echo "📦 Step 3: パブリックサブネットの作成"
PUBLIC_SUBNET_1=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=attendance-public-1a" \
  --query 'Subnets[0].SubnetId' \
  --output text 2>/dev/null || echo "")

if [ -z "${PUBLIC_SUBNET_1}" ] || [ "${PUBLIC_SUBNET_1}" = "None" ]; then
  PUBLIC_SUBNET_1=$(aws ec2 create-subnet \
    --vpc-id "${VPC_ID}" \
    --cidr-block 10.0.1.0/24 \
    --availability-zone ap-northeast-1a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=attendance-public-1a}]' \
    --query Subnet.SubnetId \
    --output text)
  echo "✅ パブリックサブネット1を作成: ${PUBLIC_SUBNET_1}"
else
  echo "✅ 既存のパブリックサブネット1を使用: ${PUBLIC_SUBNET_1}"
fi

PUBLIC_SUBNET_2=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=attendance-public-1c" \
  --query 'Subnets[0].SubnetId' \
  --output text 2>/dev/null || echo "")

if [ -z "${PUBLIC_SUBNET_2}" ] || [ "${PUBLIC_SUBNET_2}" = "None" ]; then
  PUBLIC_SUBNET_2=$(aws ec2 create-subnet \
    --vpc-id "${VPC_ID}" \
    --cidr-block 10.0.2.0/24 \
    --availability-zone ap-northeast-1c \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=attendance-public-1c}]' \
    --query Subnet.SubnetId \
    --output text)
  echo "✅ パブリックサブネット2を作成: ${PUBLIC_SUBNET_2}"
else
  echo "✅ 既存のパブリックサブネット2を使用: ${PUBLIC_SUBNET_2}"
fi

export PUBLIC_SUBNET_1 PUBLIC_SUBNET_2

# 4. プライベートサブネットの作成（RDS/ElastiCache用）
echo ""
echo "📦 Step 4: プライベートサブネットの作成"
PRIVATE_SUBNET_1=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=attendance-private-1a" \
  --query 'Subnets[0].SubnetId' \
  --output text 2>/dev/null || echo "")

if [ -z "${PRIVATE_SUBNET_1}" ] || [ "${PRIVATE_SUBNET_1}" = "None" ]; then
  PRIVATE_SUBNET_1=$(aws ec2 create-subnet \
    --vpc-id "${VPC_ID}" \
    --cidr-block 10.0.11.0/24 \
    --availability-zone ap-northeast-1a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=attendance-private-1a}]' \
    --query Subnet.SubnetId \
    --output text)
  echo "✅ プライベートサブネット1を作成: ${PRIVATE_SUBNET_1}"
else
  echo "✅ 既存のプライベートサブネット1を使用: ${PRIVATE_SUBNET_1}"
fi

PRIVATE_SUBNET_2=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=attendance-private-1c" \
  --query 'Subnets[0].SubnetId' \
  --output text 2>/dev/null || echo "")

if [ -z "${PRIVATE_SUBNET_2}" ] || [ "${PRIVATE_SUBNET_2}" = "None" ]; then
  PRIVATE_SUBNET_2=$(aws ec2 create-subnet \
    --vpc-id "${VPC_ID}" \
    --cidr-block 10.0.12.0/24 \
    --availability-zone ap-northeast-1c \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=attendance-private-1c}]' \
    --query Subnet.SubnetId \
    --output text)
  echo "✅ プライベートサブネット2を作成: ${PRIVATE_SUBNET_2}"
else
  echo "✅ 既存のプライベートサブネット2を使用: ${PRIVATE_SUBNET_2}"
fi

export PRIVATE_SUBNET_1 PRIVATE_SUBNET_2

# 5. ルートテーブルの設定（デフォルトVPCの場合はスキップ）
echo ""
echo "📦 Step 5: ルートテーブルの設定"
ROUTE_TABLE_ID=$(aws ec2 describe-route-tables \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=attendance-public-rt" \
  --query 'RouteTables[0].RouteTableId' \
  --output text 2>/dev/null || echo "")

if [ -z "${ROUTE_TABLE_ID}" ] || [ "${ROUTE_TABLE_ID}" = "None" ]; then
  ROUTE_TABLE_ID=$(aws ec2 create-route-table \
    --vpc-id "${VPC_ID}" \
    --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=attendance-public-rt}]' \
    --query RouteTable.RouteTableId \
    --output text)
  
  aws ec2 create-route \
    --route-table-id "${ROUTE_TABLE_ID}" \
    --destination-cidr-block 0.0.0.0/0 \
    --gateway-id "${IGW_ID}" 2>/dev/null || echo "ルートは既に存在します"
  
  aws ec2 associate-route-table \
    --route-table-id "${ROUTE_TABLE_ID}" \
    --subnet-id "${PUBLIC_SUBNET_1}" 2>/dev/null || echo "サブネット1は既にアソシエート済み"
  
  aws ec2 associate-route-table \
    --route-table-id "${ROUTE_TABLE_ID}" \
    --subnet-id "${PUBLIC_SUBNET_2}" 2>/dev/null || echo "サブネット2は既にアソシエート済み"
  
  echo "✅ ルートテーブルを作成・設定: ${ROUTE_TABLE_ID}"
else
  echo "✅ 既存のルートテーブルを使用: ${ROUTE_TABLE_ID}"
fi

export ROUTE_TABLE_ID

# 6. セキュリティグループの作成
echo ""
echo "📦 Step 6: セキュリティグループの作成"
ECS_SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=attendance-ecs-sg" "Name=vpc-id,Values=${VPC_ID}" \
  --query 'SecurityGroups[0].GroupId' \
  --output text 2>/dev/null || echo "")

if [ -z "${ECS_SG_ID}" ] || [ "${ECS_SG_ID}" = "None" ]; then
  ECS_SG_ID=$(aws ec2 create-security-group \
    --group-name attendance-ecs-sg \
    --description "Security group for ECS tasks" \
    --vpc-id "${VPC_ID}" \
    --query GroupId \
    --output text)
  echo "✅ ECSセキュリティグループを作成: ${ECS_SG_ID}"
else
  echo "✅ 既存のECSセキュリティグループを使用: ${ECS_SG_ID}"
fi

RDS_SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=attendance-rds-sg" "Name=vpc-id,Values=${VPC_ID}" \
  --query 'SecurityGroups[0].GroupId' \
  --output text 2>/dev/null || echo "")

if [ -z "${RDS_SG_ID}" ] || [ "${RDS_SG_ID}" = "None" ]; then
  RDS_SG_ID=$(aws ec2 create-security-group \
    --group-name attendance-rds-sg \
    --description "Security group for RDS" \
    --vpc-id "${VPC_ID}" \
    --query GroupId \
    --output text)
  echo "✅ RDSセキュリティグループを作成: ${RDS_SG_ID}"
else
  echo "✅ 既存のRDSセキュリティグループを使用: ${RDS_SG_ID}"
fi

export ECS_SG_ID RDS_SG_ID

# 7. セキュリティグループのルール設定
echo ""
echo "📦 Step 7: セキュリティグループのルール設定"
aws ec2 authorize-security-group-ingress \
  --group-id "${RDS_SG_ID}" \
  --protocol tcp \
  --port 3306 \
  --source-group "${ECS_SG_ID}" 2>/dev/null && echo "✅ ECS→RDSアクセスを許可" || echo "⚠️  ECS→RDSアクセスは既に設定済み"

aws ec2 authorize-security-group-ingress \
  --group-id "${ECS_SG_ID}" \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0 2>/dev/null && echo "✅ インターネット→ECS HTTPSアクセスを許可" || echo "⚠️  HTTPSアクセスは既に設定済み"

# 8. 結果の表示
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ネットワーク基盤の構築が完了しました！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 以下の値をメモしてください（GitHub Secretsに設定します）:"
echo ""
echo "VPC_ID: ${VPC_ID}"
echo "SUBNET_IDS: ${PUBLIC_SUBNET_1},${PUBLIC_SUBNET_2}"
echo "SECURITY_GROUP_ID: ${ECS_SG_ID}"
echo ""
echo "📝 その他の値（後で使用）:"
echo "PRIVATE_SUBNET_1: ${PRIVATE_SUBNET_1}"
echo "PRIVATE_SUBNET_2: ${PRIVATE_SUBNET_2}"
echo "RDS_SG_ID: ${RDS_SG_ID}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "次のステップ: bash scripts/setup-aws-resources.sh を実行"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

