# VPCセットアップの選択肢

## 🔍 現在の状況

VPC作成時にエラーが発生した可能性があります。現在、デフォルトVPC（`vpc-08f1650afa45efb02`）が存在しています。

## ✅ 選択肢1: デフォルトVPCを使用（簡単・推奨）

デフォルトVPCを使用すると、インターネットゲートウェイやルートテーブルが既に設定されているため、簡単に始められます。

### 手順

```bash
# 1. デフォルトVPC IDを設定
export VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=isDefault,Values=true" \
  --query 'Vpcs[0].VpcId' \
  --output text)

echo "使用するVPC ID: ${VPC_ID}"

# 2. インターネットゲートウェイを確認（デフォルトVPCには既にアタッチ済み）
export IGW_ID=$(aws ec2 describe-internet-gateways \
  --filters "Name=attachment.vpc-id,Values=${VPC_ID}" \
  --query 'InternetGateways[0].InternetGatewayId' \
  --output text)

echo "IGW ID: ${IGW_ID}"

# 3. デフォルトVPCのサブネットを使用
export PUBLIC_SUBNET_1=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=availability-zone,Values=ap-northeast-1a" \
  --query 'Subnets[0].SubnetId' \
  --output text)

export PUBLIC_SUBNET_2=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=${VPC_ID}" "Name=availability-zone,Values=ap-northeast-1c" \
  --query 'Subnets[0].SubnetId' \
  --output text)

echo "PUBLIC_SUBNET_1: ${PUBLIC_SUBNET_1}"
echo "PUBLIC_SUBNET_2: ${PUBLIC_SUBNET_2}"

# 4. セキュリティグループを作成
export ECS_SG_ID=$(aws ec2 create-security-group \
  --group-name attendance-ecs-sg \
  --description "Security group for ECS tasks" \
  --vpc-id "${VPC_ID}" \
  --query GroupId \
  --output text)

export RDS_SG_ID=$(aws ec2 create-security-group \
  --group-name attendance-rds-sg \
  --description "Security group for RDS" \
  --vpc-id "${VPC_ID}" \
  --query GroupId \
  --output text)

echo "ECS_SG_ID: ${ECS_SG_ID}"
echo "RDS_SG_ID: ${RDS_SG_ID}"

# 5. セキュリティグループのルールを設定
aws ec2 authorize-security-group-ingress \
  --group-id "${RDS_SG_ID}" \
  --protocol tcp \
  --port 3306 \
  --source-group "${ECS_SG_ID}"

aws ec2 authorize-security-group-ingress \
  --group-id "${ECS_SG_ID}" \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

echo ""
echo "✅ デフォルトVPCの設定が完了しました"
echo ""
echo "📝 以下の値をメモしてください："
echo "VPC_ID: ${VPC_ID}"
echo "PUBLIC_SUBNET_1: ${PUBLIC_SUBNET_1}"
echo "PUBLIC_SUBNET_2: ${PUBLIC_SUBNET_2}"
echo "ECS_SG_ID: ${ECS_SG_ID}"
echo "RDS_SG_ID: ${RDS_SG_ID}"
```

**メリット:**
- ✅ すぐに使用可能
- ✅ インターネットゲートウェイが既に設定済み
- ✅ ルートテーブルが既に設定済み

**デメリット:**
- ❌ デフォルトVPCは削除できない（ただし問題なし）
- ❌ CIDRブロックが172.31.0.0/16（10.0.0.0/16ではない）

---

## ✅ 選択肢2: 新しいVPCを作成（推奨）

新しいVPCを作成する場合、IAMポリシーにEC2権限が正しく設定されていることを確認してください。

### 手順

```bash
# 1. VPCを作成（タグなしで試す）
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --region ap-northeast-1 \
  --query Vpc.VpcId \
  --output text)

echo "作成されたVPC ID: ${VPC_ID}"

# 2. タグを後から追加（権限がある場合）
aws ec2 create-tags \
  --resources "${VPC_ID}" \
  --tags Key=Name,Value=attendance-vpc || echo "タグ追加はスキップ（権限不足）"

export VPC_ID

# 以降は GET_STARTED.md の Step 1.5 の手順を続行
```

---

## 🎯 推奨: デフォルトVPCを使用

ポートフォリオ用途であれば、**デフォルトVPCを使用することを推奨**します。

理由:
- 設定が簡単
- すぐに使用可能
- ポートフォリオ用途には十分

---

## 📝 次のステップ

デフォルトVPCを使用する場合、上記のコマンドを実行して変数を設定した後、`GET_STARTED.md`の **Step 2** に進んでください。

