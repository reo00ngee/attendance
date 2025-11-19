#!/bin/bash
# IAMポリシーの更新スクリプト
# 実行方法: bash scripts/update-iam-policy.sh [ポリシー名]
# 
# 注意: このスクリプトは管理者権限が必要です。
# 権限がない場合は、AWSコンソールから手動で更新してください。

set -e  # エラーが発生したら停止

echo "🔧 IAMポリシーの更新を開始します..."
echo ""

# 1. 現在のユーザー名を確認
CURRENT_USER=$(aws sts get-caller-identity --query 'Arn' --output text | cut -d'/' -f2)
echo "現在のユーザー: ${CURRENT_USER}"
echo ""

# 2. ポリシー名の取得
if [ -n "$1" ]; then
  # コマンドライン引数で指定された場合
  POLICY_NAME="$1"
  echo "指定されたポリシー名: ${POLICY_NAME}"
else
  # 既存のインラインポリシー名を取得（権限がある場合）
  echo "📋 既存のインラインポリシーを確認中..."
  POLICY_NAMES=$(aws iam list-user-policies --user-name "${CURRENT_USER}" --query 'PolicyNames' --output text 2>/dev/null || echo "")
  
  if [ -z "${POLICY_NAMES}" ] || [ "${POLICY_NAMES}" = "None" ]; then
    echo "⚠️  インラインポリシーを自動取得できませんでした"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 AWSコンソールでの手動更新方法（推奨）"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. AWSコンソール → IAM → ユーザー → ${CURRENT_USER} を選択"
    echo "2. 「アクセス許可」タブ → 「インラインポリシー」を展開"
    echo "3. 既存のポリシーを選択 → 「編集」"
    echo "4. 「JSON」タブを選択"
    echo "5. 以下のJSONをコピーして貼り付け（既存の内容を置き換え）"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cat << 'POLICY_EOF'
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
POLICY_EOF
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "6. 「次のステップ: 確認」 → 「変更の保存」"
    echo ""
    echo "または、ポリシー名が分かっている場合は、以下のコマンドで更新できます:"
    echo "  bash scripts/update-iam-policy.sh [ポリシー名]"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
  fi
  
  # 最初のポリシー名を使用（通常は1つだけ）
  POLICY_NAME=$(echo "${POLICY_NAMES}" | awk '{print $1}')
fi

echo "更新するポリシー: ${POLICY_NAME}"
echo ""

# 3. 更新されたポリシーJSONを作成
echo "📝 更新されたポリシーJSONを作成中..."
cat > /tmp/updated-policy.json << 'POLICY_EOF'
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
POLICY_EOF

echo "✅ ポリシーJSONファイルを作成: /tmp/updated-policy.json"
echo ""

# 4. ポリシーを更新
echo "🔄 ポリシーを更新中..."
aws iam put-user-policy \
  --user-name "${CURRENT_USER}" \
  --policy-name "${POLICY_NAME}" \
  --policy-document file:///tmp/updated-policy.json

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ IAMポリシーを更新しました！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 追加された権限:"
echo "  - ecr:CreateRepository"
echo "  - ecr:DescribeRepositories"
echo "  - ecr:PutImageScanningConfiguration"
echo "  - ecs:CreateCluster"
echo "  - ecs:DescribeClusters"
echo "  - s3:GetBucketLocation"
echo ""
echo "✅ 確認: 以下のコマンドで動作確認できます"
echo "  aws ecr describe-repositories --repository-names attendance-backend --region ap-northeast-1"
echo ""
echo "次のステップ: bash scripts/setup-aws-resources.sh を実行"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

