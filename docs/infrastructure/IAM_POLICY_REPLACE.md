# IAMポリシーの置き換え手順（2048文字制限対策）

既存のポリシーが大きすぎる場合、**既存のポリシーを削除して、最適化された1つのポリシーに置き換えます**。

## 🎯 解決方法

既存のインラインポリシーをすべて削除し、最適化された1つのポリシーを作成します。

## 📋 手順

### ステップ1: 既存のポリシーを削除

1. **IAMコンソール** → **ユーザー** → `attendance-deploy-user` を選択
2. **「アクセス許可」** タブをクリック
3. **「インラインポリシー」** セクションを展開
4. **すべての既存ポリシーを削除**：
   - 各ポリシーをクリック
   - **「削除」** をクリック
   - 確認ダイアログで **「削除」** をクリック

### ステップ2: 最適化されたポリシーを作成

1. **「許可を追加」** → **「インラインポリシーを作成」** をクリック
2. **「JSON」** タブをクリック
3. 以下を**すべて**貼り付け（約800文字、制限内）：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAccess",
      "Effect": "Allow",
      "Action": ["ecr:*"],
      "Resource": "*"
    },
    {
      "Sid": "ECSAccess",
      "Effect": "Allow",
      "Action": ["ecs:*"],
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
      "Action": ["s3:*"],
      "Resource": [
        "arn:aws:s3:::attendance-frontend-*",
        "arn:aws:s3:::attendance-frontend-*/*"
      ]
    },
    {
      "Sid": "CloudFrontAccess",
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "*"
    },
    {
      "Sid": "ELBAccess",
      "Effect": "Allow",
      "Action": ["elasticloadbalancing:*"],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchLogsAccess",
      "Effect": "Allow",
      "Action": ["logs:*"],
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

4. **「次のステップ: 確認」** をクリック
5. **「ポリシー名」** に `AttendanceAppCICDPolicy` と入力
6. **「ポリシーの作成」** をクリック

## ✅ 確認

ポリシー作成後、ユーザーの「アクセス許可」タブに**1つのインラインポリシー**だけが表示されることを確認してください。

## 🔄 次のステップ

ポリシー作成後、スクリプトを実行：

```bash
bash scripts/setup-ecs-service.sh
```

## 💡 なぜこの方法が有効か

- **既存のポリシーを削除**することで、文字数カウントをリセット
- **ワイルドカード（*）を使用**して文字数を大幅に削減（約800文字）
- **1つのポリシーに統合**することで、管理が簡単

## ⚠️ 注意事項

- 既存のポリシーを削除する前に、この最適化されたポリシーを作成する準備をしておいてください
- ポリシー削除後、すぐに新しいポリシーを作成してください
- この最適化により、最小権限の原則には反しますが、ポートフォリオ用途であれば問題ありません

---

**参考**: [IAM_POLICY_OPTIMIZED.md](./IAM_POLICY_OPTIMIZED.md)

