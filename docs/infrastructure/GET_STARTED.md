# 🚀 今すぐ始める！デプロイ手順書

> **⚠️ 重要:** このドキュメントは**設定手順書**です。  
> 実際のCI/CDパイプライン（自動デプロイ）は `.github/workflows/deploy.yml` が実行します。  
> この手順は**初回のみ**実行してください。2回目以降は、コードをプッシュするだけで自動デプロイされます。

> **📖 関連ドキュメント:**  
> - [AWS_ACCOUNT_SETUP.md](./AWS_ACCOUNT_SETUP.md) - 新しいAWSアカウントのセットアップ（初めての場合）  
> - [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) - CI/CDパイプラインの仕組み  
> - [README.md](./README.md) - インフラ設計の詳細

## ⚡ 最優先アクション（今すぐ実行）

### Step 0: 新しいAWSアカウントの準備（10分）

#### 0.1 AWSアカウントの作成

1. [AWS公式サイト](https://aws.amazon.com/jp/)にアクセス
2. **「アカウントを作成」**をクリック
3. メールアドレス、パスワード、アカウント名を入力
4. 電話番号認証を完了
5. クレジットカード情報を入力（**無料利用枠内なら課金されません**）

**✅ 確認:** AWSコンソールにログインできること

#### 0.2 請求アラートの設定（重要！）

予算超過を防ぐため、必ず設定してください：

1. AWSコンソール → **Billing** → **Budgets**
2. **「予算を作成」**をクリック
3. **「コスト予算」**を選択
4. 予算名: `Monthly Budget`
5. 予算額: `$60`（または希望の金額）
6. アラート設定:
   - 80%で通知: `true`
   - 100%で通知: `true`
7. 通知先のメールアドレスを入力
8. **「作成」**をクリック

**✅ 確認:** 予算が作成され、メール通知が設定されていること

#### 💰 重要：実際の月額コストについて

> **⚠️ 無料利用枠の注意点:**
> - **適用期間**: AWSアカウント作成から**12ヶ月間のみ**
> - **RDS**: `db.t2.micro`のみ対象（`db.t3.micro`は課金対象）
> - **ECS Fargate**: **無料利用枠なし**（使った分だけ課金）
> - **ALB**: **無料利用枠なし**（時間課金 + データ転送料）
> - **ElastiCache**: **無料利用枠なし**

**📊 月額コスト目安（東京リージョン）:**
- ECS Fargate (0.25 vCPU, 0.5GB): $15-30/月
- Application Load Balancer: $20-25/月
- RDS db.t3.micro (MySQL): $15-20/月
- ElastiCache cache.t3.micro (Redis): $12-15/月
- S3 + データ転送: $2-5/月
- **合計: 約$64-95/月**

**💡 コスト削減のヒント:**
- 開発中はECSタスクを1つだけ起動
- 使わないときはRDS/ElastiCacheを停止
- CloudWatchアラームで予算超過を監視

#### 0.3 IAMユーザーの作成（推奨）

ルートアカウントではなく、IAMユーザーで作業することを推奨します。**最小権限の原則**に従い、必要な権限のみを付与します：

##### ステップ1: IAMユーザーの作成

1. AWSコンソール → **IAM** → **ユーザー** → **「ユーザーを追加」**
2. ユーザー名: `attendance-deploy-user`（任意）
3. **「プログラムによるアクセス」**にチェック
4. **「次のステップ: アクセス権限」**をクリック
5. **「インラインポリシーを直接アタッチ」**を選択
6. **「ポリシーエディタ」**で **「JSON」**タブを選択
7. 以下のポリシーを貼り付け：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAccess",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:BatchGetImage",
        "ecr:CreateRepository",
        "ecr:DescribeRepositories",
        "ecr:PutImageScanningConfiguration"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECSAccess",
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTaskDefinition",
        "ecs:RegisterTaskDefinition",
        "ecs:CreateCluster",
        "ecs:DescribeClusters"
      ],
      "Resource": "*"
    },
    {
      "Sid": "EC2NetworkAccess",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVpc",
        "ec2:CreateSubnet",
        "ec2:CreateInternetGateway",
        "ec2:AttachInternetGateway",
        "ec2:CreateRouteTable",
        "ec2:CreateRoute",
        "ec2:AssociateRouteTable",
        "ec2:CreateSecurityGroup",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:DescribeVpcs",
        "ec2:DescribeSubnets",
        "ec2:DescribeInternetGateways",
        "ec2:DescribeRouteTables",
        "ec2:DescribeSecurityGroups",
        "ec2:CreateTags",
        "ec2:DescribeTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "S3Access",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:PutObjectAcl",
        "s3:CreateBucket",
        "s3:PutBucketWebsite",
        "s3:PutBucketPolicy",
        "s3:GetBucketLocation",
        "s3:PutPublicAccessBlock"
      ],
      "Resource": [
        "arn:aws:s3:::attendance-frontend-*",
        "arn:aws:s3:::attendance-frontend-*/*"
      ]
    },
    {
      "Sid": "CloudFrontAccess",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    },
    {
      "Sid": "PassRole",
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "iam:PassedToService": "ecs-tasks.amazonaws.com"
        }
      }
    }
  ]
}
```

8. **「次のステップ」** → ポリシー名: `AttendanceAppCICDPolicy` → **「次のステップ: 確認」** → **「ユーザーの作成」**
9. **重要:** アクセスキーIDとシークレットアクセスキーを**必ずメモまたはダウンロード**
   - この画面を閉じると、シークレットキーは二度と表示されません

> **💡 インラインポリシーについて:**  
> マネージドポリシーがサイズ制限に引っかかる場合、インラインポリシー（ユーザーに直接アタッチ）を使用します。  
> 機能は同じですが、ユーザーに直接紐づくため、サイズ制限の問題を回避できます。

**✅ 確認:** アクセスキーIDとシークレットアクセスキーを安全に保管していること

> **💡 認証情報の管理方法:**  
> パスワードマネージャー（Bitwarden無料版など）に保存することを強く推奨します。  
> 詳細は [CREDENTIALS_MANAGEMENT.md](./CREDENTIALS_MANAGEMENT.md) を参照してください。

#### 0.4 MFA（多要素認証）の設定（推奨）

セキュリティ強化のため、MFAを有効化：

1. IAMユーザーを選択
2. **「セキュリティ認証情報」**タブ
3. **「MFAデバイスの割り当て」**をクリック
4. 認証アプリ（Google Authenticatorなど）でQRコードをスキャン
5. 認証コードを入力して確認

**✅ 確認:** MFAが有効になっていること

---

### Step 1: AWS CLIの確認と設定（5分）

```bash
# 1. AWS CLIがインストールされているか確認
aws --version

# 2. インストールされていない場合
# macOS:
brew install awscli

# Linux (WSL):
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 3. AWS認証情報を設定
aws configure
# 以下を入力:
# AWS Access Key ID: [Step 0.3で作成したアクセスキーID]
# AWS Secret Access Key: [Step 0.3で作成したシークレットアクセスキー]
# Default region name: ap-northeast-1
# Default output format: json
```

**✅ 確認:** `aws sts get-caller-identity` でアカウント情報が表示されればOK

---

### Step 1.5: ネットワーク基盤の構築（10分）

ECSやRDSを動かすためには、VPCとサブネットが必要です。

> **💡 簡単な方法:** 以下のコマンドで一括実行できます：
> ```bash
> bash scripts/setup-network.sh
> ```
> 
> または、手動で以下のコマンドを実行：

```bash
# 1. VPCの作成
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=attendance-vpc}]' \
  --region ap-northeast-1 \
  --query Vpc.VpcId \
  --output text)

# VPC IDが正しく取得できたか確認
if [ -z "${VPC_ID}" ] || [ "${VPC_ID}" = "None" ]; then
  echo "⚠️  VPC IDが取得できませんでした。既存のVPCを確認します..."
  
  # 10.0.0.0/16のCIDRブロックを持つVPCを探す
  VPC_ID=$(aws ec2 describe-vpcs \
    --filters "Name=cidr-block,Values=10.0.0.0/16" \
    --query 'Vpcs[0].VpcId' \
    --output text)
  
  # 10.0.0.0/16のVPCが見つからない場合、デフォルトVPCを使用
  if [ -z "${VPC_ID}" ] || [ "${VPC_ID}" = "None" ]; then
    echo "10.0.0.0/16のVPCが見つかりません。デフォルトVPCを確認します..."
    VPC_ID=$(aws ec2 describe-vpcs \
      --filters "Name=isDefault,Values=true" \
      --query 'Vpcs[0].VpcId' \
      --output text)
    
    if [ -z "${VPC_ID}" ] || [ "${VPC_ID}" = "None" ]; then
      echo ""
      echo "❌ エラー: 使用可能なVPCが見つかりませんでした。"
      echo ""
      echo "利用可能なVPC一覧:"
      aws ec2 describe-vpcs --query 'Vpcs[*].[VpcId,CidrBlock,State,Tags[?Key==`Name`].Value|[0]]' --output table
      echo ""
      echo "上記のVPC一覧から、使用するVPC IDを手動で設定してください:"
      echo "export VPC_ID=vpc-xxxxxxxxx"
      echo ""
      echo "または、新しいVPCを作成してください。"
      exit 1
    else
      echo "✅ デフォルトVPCを使用します: ${VPC_ID}"
      echo "💡 デフォルトVPCは既にインターネットゲートウェイが設定されているため、すぐに使用できます。"
    fi
  else
    echo "✅ 既存のVPC（10.0.0.0/16）を使用します: ${VPC_ID}"
  fi
else
  echo "✅ 作成されたVPC ID: ${VPC_ID}"
fi

# VPC IDを環境変数としてエクスポート（後続のコマンドで使用）
export VPC_ID

# 2. インターネットゲートウェイの作成とアタッチ
# VPC_IDが設定されているか確認
if [ -z "${VPC_ID}" ]; then
  echo "❌ エラー: VPC_IDが設定されていません"
  echo "VPC_IDを手動で設定してください:"
  echo "export VPC_ID=vpc-xxxxxxxxx"
  exit 1
fi

IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=attendance-igw}]' \
  --query InternetGateway.InternetGatewayId \
  --output text)

echo "作成されたIGW ID: ${IGW_ID}"

# インターネットゲートウェイをVPCにアタッチ
aws ec2 attach-internet-gateway \
  --vpc-id "${VPC_ID}" \
  --internet-gateway-id "${IGW_ID}"

echo "✅ インターネットゲートウェイをアタッチしました"

# IGW_IDをエクスポート
export IGW_ID

# 3. パブリックサブネットの作成（2つのAZ）
PUBLIC_SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id "${VPC_ID}" \
  --cidr-block 10.0.1.0/24 \
  --availability-zone ap-northeast-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=attendance-public-1a}]' \
  --query Subnet.SubnetId \
  --output text)

PUBLIC_SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id "${VPC_ID}" \
  --cidr-block 10.0.2.0/24 \
  --availability-zone ap-northeast-1c \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=attendance-public-1c}]' \
  --query Subnet.SubnetId \
  --output text)

echo "パブリックサブネット1: ${PUBLIC_SUBNET_1}"
echo "パブリックサブネット2: ${PUBLIC_SUBNET_2}"

# 4. プライベートサブネットの作成（RDS/ElastiCache用）
PRIVATE_SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id "${VPC_ID}" \
  --cidr-block 10.0.11.0/24 \
  --availability-zone ap-northeast-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=attendance-private-1a}]' \
  --query Subnet.SubnetId \
  --output text)

PRIVATE_SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id "${VPC_ID}" \
  --cidr-block 10.0.12.0/24 \
  --availability-zone ap-northeast-1c \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=attendance-private-1c}]' \
  --query Subnet.SubnetId \
  --output text)

echo "プライベートサブネット1: ${PRIVATE_SUBNET_1}"
echo "プライベートサブネット2: ${PRIVATE_SUBNET_2}"

# 変数をエクスポート
export PUBLIC_SUBNET_1 PUBLIC_SUBNET_2 PRIVATE_SUBNET_1 PRIVATE_SUBNET_2

# 5. ルートテーブルの設定
ROUTE_TABLE_ID=$(aws ec2 create-route-table \
  --vpc-id "${VPC_ID}" \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=attendance-public-rt}]' \
  --query RouteTable.RouteTableId \
  --output text)

echo "ルートテーブルID: ${ROUTE_TABLE_ID}"

aws ec2 create-route \
  --route-table-id "${ROUTE_TABLE_ID}" \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id "${IGW_ID}"

aws ec2 associate-route-table \
  --route-table-id "${ROUTE_TABLE_ID}" \
  --subnet-id "${PUBLIC_SUBNET_1}"

aws ec2 associate-route-table \
  --route-table-id "${ROUTE_TABLE_ID}" \
  --subnet-id "${PUBLIC_SUBNET_2}"

export ROUTE_TABLE_ID

# 6. セキュリティグループの作成
ECS_SG_ID=$(aws ec2 create-security-group \
  --group-name attendance-ecs-sg \
  --description "Security group for ECS tasks" \
  --vpc-id "${VPC_ID}" \
  --query GroupId \
  --output text)

RDS_SG_ID=$(aws ec2 create-security-group \
  --group-name attendance-rds-sg \
  --description "Security group for RDS" \
  --vpc-id "${VPC_ID}" \
  --query GroupId \
  --output text)

echo "ECSセキュリティグループID: ${ECS_SG_ID}"
echo "RDSセキュリティグループID: ${RDS_SG_ID}"

export ECS_SG_ID RDS_SG_ID

# ECSからRDSへのアクセスを許可
aws ec2 authorize-security-group-ingress \
  --group-id "${RDS_SG_ID}" \
  --protocol tcp \
  --port 3306 \
  --source-group "${ECS_SG_ID}"

# インターネットからECSへのHTTPSアクセスを許可（ALB経由）
aws ec2 authorize-security-group-ingress \
  --group-id "${ECS_SG_ID}" \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

echo "✅ ネットワーク基盤の構築が完了しました"
echo ""
echo "📝 以下の値をメモしてください："
echo "VPC_ID: ${VPC_ID}"
echo "PUBLIC_SUBNET_1: ${PUBLIC_SUBNET_1}"
echo "PUBLIC_SUBNET_2: ${PUBLIC_SUBNET_2}"
echo "PRIVATE_SUBNET_1: ${PRIVATE_SUBNET_1}"
echo "PRIVATE_SUBNET_2: ${PRIVATE_SUBNET_2}"
echo "ECS_SG_ID: ${ECS_SG_ID}"
echo "RDS_SG_ID: ${RDS_SG_ID}"
```

**✅ 確認:** すべてのリソースIDをメモしたこと

---

### Step 2: 最小限のAWSリソース作成（15分）

> **💡 ヒント:** 新しいAWSアカウントには**無料利用枠**があります：
> - EC2: 750時間/月（t2.micro）
> - S3: 5GBストレージ
> - RDS: 750時間/月（db.t2.micro）
> - データ転送: 15GB/月
> 
> ただし、ECS FargateやALBは無料利用枠の対象外です。

> **💡 簡単な方法:** 以下のコマンドで一括実行できます：
> ```bash
> bash scripts/setup-aws-resources.sh
> ```
> 
> または、手動で以下のコマンドを実行：

```bash
# 1. ECRリポジトリ（Dockerイメージ保存用）
aws ecr create-repository \
  --repository-name attendance-backend \
  --region ap-northeast-1

# 2. ECSクラスター（コンテナ実行環境）
aws ecs create-cluster \
  --cluster-name attendance-cluster \
  --region ap-northeast-1

# 3. S3バケット（フロントエンド用）
# ユニークなバケット名を生成
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
TIMESTAMP=$(date +%s)
BUCKET_NAME="attendance-frontend-${AWS_ACCOUNT_ID}-${TIMESTAMP}"

echo "作成するS3バケット名: ${BUCKET_NAME}"
echo "このバケット名をメモしてください！"

# バケット作成
aws s3 mb s3://${BUCKET_NAME} --region ap-northeast-1

# 静的ウェブサイトホスティング設定
aws s3 website s3://${BUCKET_NAME} \
  --index-document index.html \
  --error-document index.html

# パブリックアクセス設定（必要に応じて）
aws s3api put-bucket-policy \
  --bucket ${BUCKET_NAME} \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::'${BUCKET_NAME}'/*"
    }]
  }'

echo ""
echo "✅ S3バケットが作成されました: ${BUCKET_NAME}"
echo "⚠️  .github/workflows/deploy.ymlのS3_BUCKET_FRONTENDをこの名前に更新してください"
```

**✅ 確認:** 3つのリソースが作成されたことを確認

---

### Step 3: GitHub Secretsの設定（5分）

1. GitHubリポジトリを開く
2. **Settings** → **Secrets and variables** → **Actions** を開く
3. **New repository secret** をクリックして以下を追加：

| Name | Value |
|------|-------|
| `AWS_ACCESS_KEY_ID` | あなたのAWSアクセスキーID |
| `AWS_SECRET_ACCESS_KEY` | あなたのAWSシークレットキー |
| `REACT_APP_API_URL` | `https://api.yourdomain.com` (後で更新) |
| `API_URL` | `https://api.yourdomain.com` (後で更新) |
| `FRONTEND_URL` | `https://yourdomain.com` (後で更新) |
| `VPC_ID` | Step 1.5で作成したVPC ID |
| `SUBNET_IDS` | パブリックサブネットのID（カンマ区切り、例: `subnet-xxx,subnet-yyy`） |
| `SECURITY_GROUP_ID` | ECS用セキュリティグループのID |

**✅ 確認:** 8つのSecretsが追加されている

---

### Step 4: ワークフローファイルの更新（5分）

`.github/workflows/deploy.yml` の16行目を編集：

```yaml
env:
  AWS_REGION: ap-northeast-1
  ECR_REPOSITORY: attendance-backend  # ← これはそのまま
  ECS_SERVICE: attendance-api-service  # ← これはそのまま
  ECS_CLUSTER: attendance-cluster  # ← これはそのまま
  ECS_TASK_DEFINITION: attendance-backend-task  # ← これはそのまま
  S3_BUCKET_FRONTEND: attendance-frontend-bucket  # ← これはそのまま
  CLOUDFRONT_DISTRIBUTION_ID: YOUR_CLOUDFRONT_DIST_ID  # ← 後で更新（今は空欄でもOK）
```

**✅ 確認:** ファイルを保存

---

### Step 5: 初回テストデプロイ（10分）

```bash
# 1. 変更をコミット
git add .
git commit -m "Add CI/CD pipeline configuration"

# 2. mainブランチにプッシュ
git push origin main

# 3. GitHub Actionsの実行を確認
# GitHubリポジトリ → Actions タブで確認
```

**✅ 確認:** GitHub Actionsが実行されている

---

## 📋 次のステップ（デプロイが成功したら）

### Phase A: データベースとキャッシュの設定（20分）

```bash
# RDS MySQLの作成（セキュアな方法）

# 1. まずSecrets Managerにパスワードを保存
DB_PASSWORD=$(openssl rand -base64 32)  # ランダムなパスワード生成
aws secretsmanager create-secret \
  --name attendance/db-password \
  --secret-string "${DB_PASSWORD}" \
  --region ap-northeast-1

echo "✅ データベースパスワードをSecrets Managerに保存しました"

# 2. RDSインスタンス作成
# 注意: <YOUR_SECURITY_GROUP_ID> と <YOUR_DB_SUBNET_GROUP> を実際の値に置き換えてください
aws rds create-db-instance \
  --db-instance-identifier attendance-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --master-username admin \
  --master-user-password "${DB_PASSWORD}" \
  --allocated-storage 20 \
  --vpc-security-group-ids <YOUR_SECURITY_GROUP_ID> \
  --db-subnet-group-name <YOUR_DB_SUBNET_GROUP> \
  --publicly-accessible false \
  --backup-retention-period 7 \
  --region ap-northeast-1

echo "✅ RDSインスタンスの作成を開始しました（完了まで約10分）"
echo "⚠️  パスワードはSecrets Manager (attendance/db-password) に保存されています"

# ElastiCache Redisの作成
aws elasticache create-cache-cluster \
  --cache-cluster-id attendance-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --region ap-northeast-1
```

### Phase B: Secrets Managerの設定（10分）

詳細なコマンドは [README.md](./README.md) の「セットアップ手順」セクションを参照してください。

```bash
# データベース接続情報を保存
aws secretsmanager create-secret \
  --name attendance/db-host \
  --secret-string "attendance-db.xxxxx.ap-northeast-1.rds.amazonaws.com" \
  --region ap-northeast-1

# 他のシークレットも同様に作成
# 詳細は README.md の「セットアップ手順」セクションを参照
```

### Phase C: ECSサービスとALBの設定（30分）

- Application Load Balancerの作成
- ECSサービスの作成
- タスク定義の登録

詳細なコマンドは [README.md](./README.md) の「セットアップ手順」セクションを参照してください。

---

## 🎯 今すぐやること（優先順位順）

1. **✅ AWS CLIの設定** - 今すぐ（5分）
2. **✅ ネットワーク基盤の構築** - 今すぐ（10分）
3. **✅ 最小限のAWSリソース作成** - 今すぐ（15分）
4. **✅ GitHub Secretsの設定** - 今すぐ（5分）
5. **✅ ワークフローファイルの確認** - 今すぐ（5分）
6. **✅ 初回テストデプロイ** - 今すぐ（10分）

**合計: 約70分でデプロイ開始可能！**

---

## 💡 ヒント

### エラーが出た場合

1. **GitHub Actionsのログを確認**
   - リポジトリ → Actions → 失敗したワークフロー → ログを確認

2. **AWSリソースが作成されているか確認**
   ```bash
   # ECRリポジトリ
   aws ecr describe-repositories --repository-names attendance-backend
   
   # ECSクラスター
   aws ecs describe-clusters --clusters attendance-cluster
   
   # S3バケット
   aws s3 ls | grep attendance-frontend
   ```

3. **IAM権限を確認**
   - AWSコンソール → IAM → ユーザー → あなたのユーザー → 権限を確認

### 時間がない場合

最小限の構成で進める：
- ✅ ECR + ECS + S3 だけ作成
- ✅ RDSとElastiCacheは後回し（ローカル開発環境でテスト）
- ✅ ALBとCloudFrontも後回し（直接アクセスでテスト）

---

## 📚 詳細ドキュメント

- **インフラ設計詳細**: [README.md](./README.md)
- **CI/CDパイプラインの仕組み**: [HOW_IT_WORKS.md](./HOW_IT_WORKS.md)

---

## 🆘 困ったときは

1. GitHub Actionsのログを確認
2. AWS CloudWatch Logsを確認
3. ECSサービスのイベントを確認
4. `ACTION_ITEMS.md`のトラブルシューティングセクションを参照

---

**🚀 さあ、始めましょう！**

