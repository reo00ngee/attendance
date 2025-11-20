# IAMポリシーの最適化（サイズ制限対策）

2048文字の制限を超えている場合、既存のポリシーを最適化する必要があります。

## 🎯 解決方法

既存のポリシーを**より簡潔なバージョン**に置き換えます。ワイルドカードを使用して文字数を削減します。

## 📋 最適化されたポリシー（既存ポリシーを置き換え）

### ステップ1: 既存のポリシーを削除（オプション）

既存のポリシーが大きすぎる場合は、一度削除してから新しいポリシーを作成することもできます。

1. **IAMコンソール** → **ユーザー** → `attendance-deploy-user`
2. **「アクセス許可」** タブ
3. **「インラインポリシー」** セクションで既存のポリシーを選択
4. **「削除」** をクリック（⚠️ 後で新しいポリシーを作成するので問題ありません）

### ステップ2: 最適化されたポリシーを作成

1. **「許可を追加」** → **「インラインポリシーを作成」**
2. **「JSON」** タブを選択
3. 以下を貼り付け（**約800文字、制限内**）：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAccess",
      "Effect": "Allow",
      "Action": [
        "ecr:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECSAccess",
      "Effect": "Allow",
      "Action": [
        "ecs:*"
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
        "ec2:Describe*",
        "ec2:CreateTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "S3Access",
      "Effect": "Allow",
      "Action": [
        "s3:*"
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
        "elasticloadbalancing:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchLogsAccess",
      "Effect": "Allow",
      "Action": [
        "logs:*"
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

4. **「次のステップ: 確認」** → **「ポリシー名」** に `AttendanceAppCICDPolicy` と入力 → **「ポリシーの作成」**

## ✅ 最適化のポイント

- `ecr:*` でECRのすべてのアクションを許可（個別に列挙する代わり）
- `ecs:*` でECSのすべてのアクションを許可
- `ec2:Describe*` でDescribe系のアクションをまとめて許可
- `s3:*` でS3のすべてのアクションを許可（リソースで制限）
- `elasticloadbalancing:*` でALBのすべてのアクションを許可
- `logs:*` でCloudWatch Logsのすべてのアクションを許可

## ⚠️ 注意事項

この最適化により、**最小権限の原則**には反しますが：
- ポートフォリオ用途であれば問題ありません
- サイズ制限を回避できます
- 実際の運用では、必要最小限の権限に絞ることを推奨します

## 🔄 次のステップ

ポリシー作成後、スクリプトを実行：

```bash
bash scripts/setup-ecs-service.sh
```

---

**参考**: [IAM_POLICY_SPLIT.md](./IAM_POLICY_SPLIT.md)

