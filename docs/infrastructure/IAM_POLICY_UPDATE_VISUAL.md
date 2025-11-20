# IAMポリシー更新の視覚的ガイド

## 🎯 何をしているか

`attendance-deploy-user`というIAMユーザーに、ALB（ロードバランサー）とECSサービスを作成する権限を追加します。

## 📋 手順（画像付き説明）

### 1. IAMコンソールを開く

```
AWSコンソール → 検索バーで「IAM」と検索 → IAMをクリック
```

### 2. ユーザーを選択

```
IAM → 左メニュー「ユーザー」→ 「attendance-deploy-user」をクリック
```

### 3. アクセス許可タブを開く

```
「アクセス許可」タブをクリック
```

### 4. インラインポリシーを展開

```
「インラインポリシー」セクションを展開
（通常、1つのポリシーが表示されます）
```

### 5. ポリシーを編集

```
表示されているポリシー名をクリック → 「編集」ボタンをクリック
```

### 6. JSONタブを選択

```
「JSON」タブをクリック
```

### 7. JSONを編集

現在のJSONは以下のような構造になっています：

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
    },
    {
      "Sid": "EC2NetworkAccess",
      ...
    },
    {
      "Sid": "S3Access",
      ...
    },
    {
      "Sid": "CloudFrontAccess",
      ...
    },
    {
      "Sid": "PassRole",
      ...
    }
  ]
}
```

**最後の`PassRole`の後に、以下の3つのブロックを追加します：**

```json
    },  ← 最後の要素の後にカンマを追加
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

### 8. 保存

1. **「次のステップ: 確認」** をクリック
2. エラーがないか確認（JSONの構文エラーがある場合は赤く表示されます）
3. **「変更の保存」** をクリック

## ✅ 確認方法

ポリシー更新後、以下のコマンドで確認できます：

```bash
# ALB一覧を取得（権限があれば成功）
aws elbv2 describe-load-balancers --region ap-northeast-1
```

エラーが出なければ、権限が正しく設定されています。

## 🔄 次のステップ

ポリシー更新後、以下のコマンドでALBとECSサービスを作成：

```bash
bash scripts/setup-ecs-service.sh
```

---

**トラブルシューティング**: JSONの構文エラーが出る場合は、カンマの位置を確認してください。

