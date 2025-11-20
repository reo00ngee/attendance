# ECSロールの作成手順

ECSタスクを実行するには、以下の2つのIAMロールが必要です：

1. **ECSタスク実行ロール** (`ecsTaskExecutionRole`) - ECRからイメージをプル、CloudWatch Logsに書き込み、Secrets Managerからシークレットを取得
2. **ECSタスクロール** (`ecsTaskRole`) - アプリケーションがAWSサービスにアクセスするためのロール

## 📋 作成手順

### 方法1: AWSコンソールで作成（推奨）

#### 1. ECSタスク実行ロールの作成

1. **IAMコンソール** → **ロール** → **ロールを作成**
2. **信頼されたエンティティタイプ**: AWS のサービス
3. **ユースケース**: Elastic Container Service → **Elastic Container Service タスク** → **次へ**
4. **許可ポリシー**: `AmazonECSTaskExecutionRolePolicy` を検索して選択 → **次へ**
5. **ロール名**: `ecsTaskExecutionRole` → **ロールを作成**

#### 2. ECSタスクロールの作成

1. **IAMコンソール** → **ロール** → **ロールを作成**
2. **信頼されたエンティティタイプ**: AWS のサービス
3. **ユースケース**: Elastic Container Service → **Elastic Container Service タスク** → **次へ**
4. **許可ポリシー**: 今回は最小限（後で必要に応じて追加）→ **次へ**
5. **ロール名**: `ecsTaskRole` → **ロールを作成**

6. 作成後、ロールを選択 → **許可を追加** → **インラインポリシーを作成**
7. **JSON**タブを選択して、以下を貼り付け：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

8. **ポリシー名**: `ECSBasicPolicy` → **ポリシーを作成**

### 方法2: AWS CLIで作成（管理者権限が必要）

```bash
bash scripts/setup-ecs-roles.sh
```

**注意**: `attendance-deploy-user`にはIAMロール作成権限がないため、管理者権限を持つユーザーで実行する必要があります。

## ✅ 確認

ロールが作成されたら、以下を確認：

```bash
# タスク実行ロール
aws iam get-role --role-name ecsTaskExecutionRole

# タスクロール
aws iam get-role --role-name ecsTaskRole
```

## 📝 タスク定義ファイルの更新

ロール作成後、`.github/aws/task-definition.json`の以下を確認：

- `executionRoleArn`: `arn:aws:iam::158259501930:role/ecsTaskExecutionRole`
- `taskRoleArn`: `arn:aws:iam::158259501930:role/ecsTaskRole`
- `YOUR_ACCOUNT_ID`を`158259501930`に置き換え

## 🔄 次のステップ

ロール作成後、再度デプロイを実行：

```bash
git push origin main
```

---

**参考**: [GET_STARTED.md](./GET_STARTED.md)

