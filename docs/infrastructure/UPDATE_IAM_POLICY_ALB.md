# IAMポリシーにALB権限を追加

ECSサービスとALBを作成するには、IAMポリシーに以下の権限を追加する必要があります。

## 🎯 この作業の目的

現在、`attendance-deploy-user`にはALB（ロードバランサー）を作成する権限がありません。
この権限を追加することで、`bash scripts/setup-ecs-service.sh` を実行してALBとECSサービスを自動的に作成できるようになります。

## 📝 追加する権限

以下の権限をIAMポリシーに追加してください：

```json
{
  "Sid": "ELBAccess",
  "Effect": "Allow",
  "Action": [
    "elasticloadbalancing:CreateLoadBalancer",
    "elasticloadbalancing:CreateTargetGroup",
    "elasticloadbalancing:CreateListener",
    "elasticloadbalancing:DescribeLoadBalancers",
    "elasticloadbalancing:DescribeTargetGroups",
    "elasticloadbalancing:DescribeListeners",
    "elasticloadbalancing:ModifyLoadBalancerAttributes",
    "elasticloadbalancing:DeleteLoadBalancer",
    "elasticloadbalancing:DeleteTargetGroup",
    "elasticloadbalancing:DeleteListener"
  ],
  "Resource": "*"
},
{
  "Sid": "ECSAccessExtended",
  "Effect": "Allow",
  "Action": [
    "ecs:CreateService",
    "ecs:DescribeServices",
    "ecs:UpdateService",
    "ecs:DeleteService",
    "ecs:ListServices",
    "ecs:ListTasks",
    "ecs:DescribeTasks"
  ],
  "Resource": "*"
},
{
  "Sid": "CloudWatchLogsAccess",
  "Effect": "Allow",
  "Action": [
    "logs:CreateLogGroup",
    "logs:DescribeLogGroups",
    "logs:PutRetentionPolicy"
  ],
  "Resource": "*"
}
```

## 🔧 更新手順（AWSコンソールで更新）

### ステップ1: IAMコンソールを開く

1. **AWSコンソール**にログイン
2. 検索バーで **「IAM」** と検索して開く
3. 左側メニューから **「ユーザー」** をクリック
4. **「attendance-deploy-user」** をクリック

### ステップ2: インラインポリシーを編集

1. **「アクセス許可」** タブをクリック
2. **「インラインポリシー」** セクションを展開
3. 既存のポリシー（通常は1つだけ）をクリック
4. **「編集」** ボタンをクリック

### ステップ3: JSONを編集

1. **「JSON」** タブをクリック
2. 既存のJSONが表示されます
3. **`"Statement": [`** の後に、以下のJSONを追加します

**追加するJSON（3つのブロック）:**

```json
    {
      "Sid": "ELBAccess",
      "Effect": "Allow",
      "Action": [
        "elasticloadbalancing:CreateLoadBalancer",
        "elasticloadbalancing:CreateTargetGroup",
        "elasticloadbalancing:CreateListener",
        "elasticloadbalancing:DescribeLoadBalancers",
        "elasticloadbalancing:DescribeTargetGroups",
        "elasticloadbalancing:DescribeListeners",
        "elasticloadbalancing:ModifyLoadBalancerAttributes",
        "elasticloadbalancing:DeleteLoadBalancer",
        "elasticloadbalancing:DeleteTargetGroup",
        "elasticloadbalancing:DeleteListener"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECSAccessExtended",
      "Effect": "Allow",
      "Action": [
        "ecs:CreateService",
        "ecs:DescribeServices",
        "ecs:UpdateService",
        "ecs:DeleteService",
        "ecs:ListServices",
        "ecs:ListTasks",
        "ecs:DescribeTasks"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchLogsAccess",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:DescribeLogGroups",
        "logs:PutRetentionPolicy"
      ],
      "Resource": "*"
    },
```

**⚠️ 重要:** 
- 既存の`Statement`配列の最後の要素の後に、**カンマ（,）**を追加してから上記を貼り付け
- 最後の要素の後にはカンマを付けない

### ステップ4: 保存

1. **「次のステップ: 確認」** をクリック
2. ポリシーが正しく表示されることを確認
3. **「変更の保存」** をクリック

### 📸 例：JSONの構造

既存のポリシーが以下のような構造の場合：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAccess",
      ...
    },
    {
      "Sid": "ECSAccess",
      ...
    }
  ]
}
```

以下のように追加します（最後の要素の後にカンマを追加）：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAccess",
      ...
    },
    {
      "Sid": "ECSAccess",
      ...
    },  ← ここにカンマを追加
    {
      "Sid": "ELBAccess",
      ...
    },
    {
      "Sid": "ECSAccessExtended",
      ...
    },
    {
      "Sid": "CloudWatchLogsAccess",
      ...
    }
  ]
}
```

### 方法2: 完全なポリシーJSON

既存のポリシーを以下の完全なJSONで置き換えることもできます：

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
        "ecs:DescribeClusters",
        "ecs:CreateService",
        "ecs:ListServices",
        "ecs:ListTasks",
        "ecs:DescribeTasks"
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
      "Sid": "ELBAccess",
      "Effect": "Allow",
      "Action": [
        "elasticloadbalancing:CreateLoadBalancer",
        "elasticloadbalancing:CreateTargetGroup",
        "elasticloadbalancing:CreateListener",
        "elasticloadbalancing:DescribeLoadBalancers",
        "elasticloadbalancing:DescribeTargetGroups",
        "elasticloadbalancing:DescribeListeners",
        "elasticloadbalancing:ModifyLoadBalancerAttributes",
        "elasticloadbalancing:DeleteLoadBalancer",
        "elasticloadbalancing:DeleteTargetGroup",
        "elasticloadbalancing:DeleteListener"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchLogsAccess",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:DescribeLogGroups",
        "logs:PutRetentionPolicy"
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

## ✅ 確認

ポリシー更新後、以下のコマンドで動作確認：

```bash
# ALB作成権限の確認
aws elbv2 describe-load-balancers --region ap-northeast-1

# ECSサービス作成権限の確認
aws ecs list-services --cluster attendance-cluster --region ap-northeast-1
```

エラーが出なければ、権限が正しく設定されています。

## 🔄 次のステップ

ポリシー更新後、スクリプトを実行：

```bash
bash scripts/setup-ecs-service.sh
```

---

**参考**: [ECS_SERVICE_SETUP.md](./ECS_SERVICE_SETUP.md)

