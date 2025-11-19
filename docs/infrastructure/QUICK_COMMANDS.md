# クイックコマンド集 - ネットワーク構築

## 🔍 現在の状態を確認

```bash
# すべての変数を確認
echo "VPC_ID: ${VPC_ID}"
echo "IGW_ID: ${IGW_ID}"
echo "PUBLIC_SUBNET_1: ${PUBLIC_SUBNET_1}"
echo "PUBLIC_SUBNET_2: ${PUBLIC_SUBNET_2}"
echo "ECS_SG_ID: ${ECS_SG_ID}"
echo "RDS_SG_ID: ${RDS_SG_ID}"
```

## 🚀 デフォルトVPCを使用して変数を設定（一括実行）

```bash
# デフォルトVPCを使用してすべての変数を設定
export VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)
export IGW_ID=$(aws ec2 describe-internet-gateways --filters "Name=attachment.vpc-id,Values=${VPC_ID}" --query 'InternetGateways[0].InternetGatewayId' --output text)
export PUBLIC_SUBNET_1=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VPC_ID}" "Name=availability-zone,Values=ap-northeast-1a" --query 'Subnets[0].SubnetId' --output text)
export PUBLIC_SUBNET_2=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VPC_ID}" "Name=availability-zone,Values=ap-northeast-1c" --query 'Subnets[0].SubnetId' --output text)

echo "✅ 変数が設定されました:"
echo "VPC_ID: ${VPC_ID}"
echo "IGW_ID: ${IGW_ID}"
echo "PUBLIC_SUBNET_1: ${PUBLIC_SUBNET_1}"
echo "PUBLIC_SUBNET_2: ${PUBLIC_SUBNET_2}"
```

## 🔧 セキュリティグループの作成

```bash
# ECS用セキュリティグループ
export ECS_SG_ID=$(aws ec2 create-security-group \
  --group-name attendance-ecs-sg \
  --description "Security group for ECS tasks" \
  --vpc-id "${VPC_ID}" \
  --query GroupId \
  --output text 2>&1 | grep -q "already exists" && \
  aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=attendance-ecs-sg" "Name=vpc-id,Values=${VPC_ID}" \
    --query 'SecurityGroups[0].GroupId' \
    --output text || \
  aws ec2 create-security-group \
    --group-name attendance-ecs-sg \
    --description "Security group for ECS tasks" \
    --vpc-id "${VPC_ID}" \
    --query GroupId \
    --output text)

# RDS用セキュリティグループ
export RDS_SG_ID=$(aws ec2 create-security-group \
  --group-name attendance-rds-sg \
  --description "Security group for RDS" \
  --vpc-id "${VPC_ID}" \
  --query GroupId \
  --output text 2>&1 | grep -q "already exists" && \
  aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=attendance-rds-sg" "Name=vpc-id,Values=${VPC_ID}" \
    --query 'SecurityGroups[0].GroupId' \
    --output text || \
  aws ec2 create-security-group \
    --group-name attendance-rds-sg \
    --description "Security group for RDS" \
    --vpc-id "${VPC_ID}" \
    --query GroupId \
    --output text)

echo "ECS_SG_ID: ${ECS_SG_ID}"
echo "RDS_SG_ID: ${RDS_SG_ID}"
```

## 🔗 セキュリティグループのルール設定

```bash
# ECSからRDSへのアクセスを許可（既に設定されている場合はエラーが出ますが、問題ありません）
aws ec2 authorize-security-group-ingress \
  --group-id "${RDS_SG_ID}" \
  --protocol tcp \
  --port 3306 \
  --source-group "${ECS_SG_ID}" 2>/dev/null || echo "ルールは既に設定済みです"

# インターネットからECSへのHTTPSアクセスを許可
aws ec2 authorize-security-group-ingress \
  --group-id "${ECS_SG_ID}" \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0 2>/dev/null || echo "ルールは既に設定済みです"
```

## 📝 すべての値をメモ

```bash
echo ""
echo "📝 以下の値をメモしてください："
echo "VPC_ID: ${VPC_ID}"
echo "IGW_ID: ${IGW_ID}"
echo "PUBLIC_SUBNET_1: ${PUBLIC_SUBNET_1}"
echo "PUBLIC_SUBNET_2: ${PUBLIC_SUBNET_2}"
echo "PRIVATE_SUBNET_1: ${PRIVATE_SUBNET_1:-未設定}"
echo "PRIVATE_SUBNET_2: ${PRIVATE_SUBNET_2:-未設定}"
echo "ECS_SG_ID: ${ECS_SG_ID}"
echo "RDS_SG_ID: ${RDS_SG_ID}"
```

## ✅ 次のステップ

変数が設定されたら、`GET_STARTED.md`の **Step 2** に進んでください。

