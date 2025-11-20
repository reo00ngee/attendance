# IAMポリシーの分割方法（サイズ制限対策）

ポリシーが2048文字の制限を超えている場合、ALB関連の権限を**別のインラインポリシー**として作成します。

## 🎯 解決方法

既存のポリシーはそのままにして、ALB関連の権限を**新しいインラインポリシー**として追加します。

## 📋 手順

### ステップ1: 新しいインラインポリシーを作成

1. **IAMコンソール** → **ユーザー** → `attendance-deploy-user` を選択
2. **「アクセス許可」** タブをクリック
3. **「許可を追加」** → **「インラインポリシーを作成」** をクリック
4. **「JSON」** タブをクリック
5. 以下を貼り付け：

```json
{
  "Version": "2012-10-17",
  "Statement": [
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
  ]
}
```

6. **「次のステップ: 確認」** をクリック
7. **「ポリシー名」** に `AttendanceAppALBPolicy` と入力
8. **「ポリシーを作成」** をクリック

## ✅ 確認

ポリシー作成後、ユーザーの「アクセス許可」タブに2つのインラインポリシーが表示されます：

1. 既存のポリシー（元のポリシー）
2. `AttendanceAppALBPolicy`（新しく作成したポリシー）

## 🔄 次のステップ

ポリシー作成後、スクリプトを実行：

```bash
bash scripts/setup-ecs-service.sh
```

## 💡 なぜ分割するのか？

- インラインポリシーは1ユーザーあたり**合計2048文字**の制限があります
- 既存のポリシーが大きい場合、追加すると制限を超えてしまいます
- 別のインラインポリシーとして作成することで、制限を回避できます

---

**参考**: [UPDATE_IAM_POLICY_ALB.md](./UPDATE_IAM_POLICY_ALB.md)

