# IAMポリシーの代替方法

## 🔴 問題: ポリシーサイズがクォータを超える

**エラーメッセージ:**
```
選択されたポリシーがこのアカウントのクォータを超えています
```

**原因:**
AWSのIAMマネージドポリシーにはサイズ制限があります（約6,144文字）。

## ✅ 解決方法: インラインポリシーを使用

インラインポリシー（ユーザーに直接アタッチ）を使用することで、サイズ制限の問題を回避できます。

### 方法1: AWSコンソールでインラインポリシーを追加（推奨）

1. **IAMユーザーを作成**（まだの場合）
   - IAM → ユーザー → ユーザーを追加
   - ユーザー名: `attendance-deploy-user`
   - 「プログラムによるアクセス」にチェック
   - 「次のステップ: アクセス権限」をクリック

2. **インラインポリシーを追加**
   - 「インラインポリシーを直接アタッチ」を選択
   - 「ポリシーエディタ」で「JSON」タブを選択
   - 以下のポリシーを貼り付け：

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
        "ecr:BatchGetImage"
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
        "ecs:RegisterTaskDefinition"
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
        "s3:PutBucketPolicy"
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

3. **ポリシー名を入力**
   - ポリシー名: `AttendanceAppCICDPolicy`
   - 「次のステップ: 確認」→「ユーザーの作成」

4. **アクセスキーを保存**
   - アクセスキーIDとシークレットアクセスキーを必ず保存

---

### 方法2: 既存ユーザーにインラインポリシーを追加

既にユーザーを作成している場合：

1. IAM → ユーザー → `attendance-deploy-user` を選択
2. 「許可」タブ → 「インラインポリシーを追加」→「JSON」タブ
3. 上記のポリシーを貼り付け
4. ポリシー名: `AttendanceAppCICDPolicy`
5. 「ポリシーの作成」をクリック

---

### 方法3: AWS CLIでインラインポリシーを追加

```bash
# ポリシードキュメントをファイルに保存
cat > policy.json <<'EOF'
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
        "ecr:BatchGetImage"
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
        "ecs:RegisterTaskDefinition"
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
        "s3:PutBucketPolicy"
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

# インラインポリシーを追加
aws iam put-user-policy \
  --user-name attendance-deploy-user \
  --policy-name AttendanceAppCICDPolicy \
  --policy-document file://policy.json

# 確認
aws iam get-user-policy \
  --user-name attendance-deploy-user \
  --policy-name AttendanceAppCICDPolicy
```

---

## 📊 インラインポリシー vs マネージドポリシー

| 項目 | インラインポリシー | マネージドポリシー |
|------|------------------|------------------|
| サイズ制限 | より緩い（約10,240文字） | 約6,144文字 |
| 再利用性 | ユーザーごとに個別 | 複数ユーザーで共有可能 |
| 管理 | ユーザーに紐づく | 独立して管理 |
| 推奨用途 | この場合 | 複数ユーザーで共有する場合 |

**このプロジェクトでは:** インラインポリシーで問題ありません。

---

## 🔍 確認方法

ポリシーが正しく追加されたか確認：

```bash
# インラインポリシーを確認
aws iam list-user-policies --user-name attendance-deploy-user

# ポリシーの内容を確認
aws iam get-user-policy \
  --user-name attendance-deploy-user \
  --policy-name AttendanceAppCICDPolicy
```

---

## 🆘 まだエラーが出る場合

### オプション1: ポリシーを分割

複数のインラインポリシーに分割：

1. `AttendanceAppCICD-ECR-ECS`（ECRとECS用）
2. `AttendanceAppCICD-EC2`（EC2ネットワーク用）
3. `AttendanceAppCICD-S3-CloudFront`（S3とCloudFront用）

### オプション2: ワイルドカードを使用して簡略化

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:*",
        "ecs:*",
        "ec2:*",
        "s3:*",
        "cloudfront:CreateInvalidation",
        "iam:PassRole"
      ],
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

> **⚠️ 注意:** この方法は最小権限の原則に反しますが、サイズ制限を回避できます。  
> ポートフォリオ用途であれば、この方法でも問題ありません。

---

**🔗 関連ドキュメント:**
- [GET_STARTED.md](./GET_STARTED.md) - デプロイ手順
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - トラブルシューティング

