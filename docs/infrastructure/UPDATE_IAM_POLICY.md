# IAMポリシーの更新手順

ECRやECSのリソース作成に必要な権限が不足している場合、IAMポリシーを更新する必要があります。

## 🔧 更新が必要な権限

以下の権限が追加されました：

### ECR権限
- `ecr:CreateRepository` - リポジトリ作成
- `ecr:DescribeRepositories` - リポジトリ情報取得
- `ecr:PutImageScanningConfiguration` - イメージスキャン設定

### ECS権限
- `ecs:CreateCluster` - クラスター作成
- `ecs:DescribeClusters` - クラスター情報取得

### S3権限
- `s3:GetBucketLocation` - バケットの場所取得

## 📝 更新手順

### 方法1: AWSコンソールで更新（推奨）

1. **IAMコンソール**にアクセス
2. **「ユーザー」** → `attendance-deploy-user` を選択
3. **「アクセス許可」**タブ → **「インラインポリシー」**を展開
4. 既存のポリシーを選択 → **「編集」**
5. **「JSON」**タブを選択
6. 以下のJSONをコピーして貼り付け（既存の内容を置き換え）

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
        "s3:GetBucketLocation"
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

7. **「次のステップ: 確認」** → **「変更の保存」**

### 方法2: AWS CLIで更新

```bash
# 1. 更新されたポリシーJSONをファイルに保存
cat > /tmp/updated-policy.json << 'EOF'
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
        "s3:GetBucketLocation"
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
EOF

# 2. 既存のインラインポリシー名を確認
POLICY_NAME=$(aws iam list-user-policies --user-name attendance-deploy-user --query 'PolicyNames[0]' --output text)

# 3. ポリシーを更新
aws iam put-user-policy \
  --user-name attendance-deploy-user \
  --policy-name "${POLICY_NAME}" \
  --policy-document file:///tmp/updated-policy.json

echo "✅ IAMポリシーを更新しました"
```

## ✅ 確認

ポリシー更新後、以下のコマンドで動作確認：

```bash
# ECRリポジトリの確認
aws ecr describe-repositories --repository-names attendance-backend --region ap-northeast-1

# ECSクラスターの確認
aws ecs describe-clusters --clusters attendance-cluster --region ap-northeast-1
```

エラーが出なければ、権限が正しく設定されています。

## 🔄 次のステップ

ポリシー更新後、再度スクリプトを実行：

```bash
bash scripts/setup-aws-resources.sh
```

---

**参考:** [GET_STARTED.md](./GET_STARTED.md) の Step 0.3 も更新されています。

