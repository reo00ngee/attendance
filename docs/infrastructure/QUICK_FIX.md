# クイックフィックス - 変数が失われた場合

## 🔴 問題: VPC_IDなどの変数が空になっている

**エラーメッセージ:**
```
aws: [ERROR]: argument --vpc-id: expected one argument
```

**原因:**
シェルセッションが切れた、または変数が正しく設定されていない。

## ✅ 解決方法

### 方法1: 既存のVPC IDを取得

```bash
# VPC IDを取得
VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=cidr-block,Values=10.0.0.0/16" \
  --query 'Vpcs[0].VpcId' \
  --output text)

echo "VPC ID: ${VPC_ID}"

# 変数が正しく設定されたか確認
if [ -z "${VPC_ID}" ] || [ "${VPC_ID}" = "None" ]; then
  echo "❌ VPCが見つかりませんでした"
  exit 1
fi

# 環境変数としてエクスポート
export VPC_ID
```

### 方法2: すべての変数を再取得するスクリプト

```bash
#!/bin/bash

# VPC IDを取得
VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=cidr-block,Values=10.0.0.0/16" \
  --query 'Vpcs[0].VpcId' \
  --output text)

if [ -z "${VPC_ID}" ] || [ "${VPC_ID}" = "None" ]; then
  echo "❌ VPCが見つかりませんでした"
  exit 1
fi

echo "VPC ID: ${VPC_ID}"
export VPC_ID

# インターネットゲートウェイIDを取得
IGW_ID=$(aws ec2 describe-internet-gateways \
  --filters "Name=attachment.vpc-id,Values=${VPC_ID}" \
  --query 'InternetGateways[0].InternetGatewayId' \
  --output text)

if [ -z "${IGW_ID}" ] || [ "${IGW_ID}" = "None" ]; then
  echo "⚠️ インターネットゲートウェイが見つかりません。作成します..."
  IGW_ID=$(aws ec2 create-internet-gateway \
    --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=attendance-igw}]' \
    --query InternetGateway.InternetGatewayId \
    --output text)
  aws ec2 attach-internet-gateway \
    --vpc-id "${VPC_ID}" \
    --internet-gateway-id "${IGW_ID}"
fi

echo "IGW ID: ${IGW_ID}"
export IGW_ID

# サブネットIDを取得
PUBLIC_SUBNET_1=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=attendance-public-1a" \
  --query 'Subnets[0].SubnetId' \
  --output text)

PUBLIC_SUBNET_2=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=attendance-public-1c" \
  --query 'Subnets[0].SubnetId' \
  --output text)

PRIVATE_SUBNET_1=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=attendance-private-1a" \
  --query 'Subnets[0].SubnetId' \
  --output text)

PRIVATE_SUBNET_2=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:Name,Values=attendance-private-1c" \
  --query 'Subnets[0].SubnetId' \
  --output text)

echo "PUBLIC_SUBNET_1: ${PUBLIC_SUBNET_1}"
echo "PUBLIC_SUBNET_2: ${PUBLIC_SUBNET_2}"
echo "PRIVATE_SUBNET_1: ${PRIVATE_SUBNET_1}"
echo "PRIVATE_SUBNET_2: ${PRIVATE_SUBNET_2}"

export PUBLIC_SUBNET_1 PUBLIC_SUBNET_2 PRIVATE_SUBNET_1 PRIVATE_SUBNET_2

# セキュリティグループIDを取得
ECS_SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=group-name,Values=attendance-ecs-sg" \
  --query 'SecurityGroups[0].GroupId' \
  --output text)

RDS_SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=group-name,Values=attendance-rds-sg" \
  --query 'SecurityGroups[0].GroupId' \
  --output text)

echo "ECS_SG_ID: ${ECS_SG_ID}"
echo "RDS_SG_ID: ${RDS_SG_ID}"

export ECS_SG_ID RDS_SG_ID

echo ""
echo "✅ すべての変数が設定されました"
echo ""
echo "📝 以下の値をメモしてください："
echo "VPC_ID: ${VPC_ID}"
echo "IGW_ID: ${IGW_ID}"
echo "PUBLIC_SUBNET_1: ${PUBLIC_SUBNET_1}"
echo "PUBLIC_SUBNET_2: ${PUBLIC_SUBNET_2}"
echo "PRIVATE_SUBNET_1: ${PRIVATE_SUBNET_1}"
echo "PRIVATE_SUBNET_2: ${PRIVATE_SUBNET_2}"
echo "ECS_SG_ID: ${ECS_SG_ID}"
echo "RDS_SG_ID: ${RDS_SG_ID}"
```

このスクリプトを `restore-variables.sh` として保存して実行：

```bash
chmod +x restore-variables.sh
./restore-variables.sh
```

### 方法3: 手動で変数を設定

VPC IDが分かっている場合：

```bash
# VPC IDを手動で設定（実際のVPC IDに置き換える）
export VPC_ID=vpc-xxxxxxxxx

# 確認
echo "VPC ID: ${VPC_ID}"

# インターネットゲートウェイをアタッチ
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=attendance-igw}]' \
  --query InternetGateway.InternetGatewayId \
  --output text)

aws ec2 attach-internet-gateway \
  --vpc-id "${VPC_ID}" \
  --internet-gateway-id "${IGW_ID}"

export IGW_ID
```

---

## 💡 予防策

### すべてのコマンドを1つのスクリプトにまとめる

`setup-network.sh` として保存：

```bash
#!/bin/bash
set -e  # エラーが発生したら停止

# VPCの作成
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=attendance-vpc}]' \
  --query Vpc.VpcId \
  --output text)

echo "VPC ID: ${VPC_ID}"

# 以降のコマンド...
```

実行：
```bash
chmod +x setup-network.sh
./setup-network.sh
```

これで、変数が失われることなく、すべてのコマンドが順番に実行されます。

---

## 🔍 変数が設定されているか確認

```bash
# すべての変数を確認
echo "VPC_ID: ${VPC_ID}"
echo "IGW_ID: ${IGW_ID}"
echo "PUBLIC_SUBNET_1: ${PUBLIC_SUBNET_1}"
echo "PUBLIC_SUBNET_2: ${PUBLIC_SUBNET_2}"

# 変数が空でないか確認
if [ -z "${VPC_ID}" ]; then
  echo "❌ VPC_IDが設定されていません"
else
  echo "✅ VPC_IDは設定されています: ${VPC_ID}"
fi
```

