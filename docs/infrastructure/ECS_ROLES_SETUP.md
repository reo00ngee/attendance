# ECSロールの作成手順

ECSタスクを実行するには、以下の2つのIAMロールが必要です：

1. **ECSタスク実行ロール** (`ecsTaskExecutionRole`) - ECRからイメージをプル、CloudWatch Logsに書き込み、Secrets Managerからシークレットを取得
2. **ECSタスクロール** (`ecsTaskRole`) - アプリケーションがAWSサービスにアクセスするためのロール

## 📋 作成手順

### 方法1: AWSコンソールで作成（推奨）

#### 1. ECSタスク実行ロールの作成

1. **IAMコンソール**にアクセス: https://console.aws.amazon.com/iam/
2. 左側メニューから **「ロール」** をクリック
3. **「ロールを作成」** ボタンをクリック
4. **「信頼されたエンティティタイプを選択」** で **「AWS のサービス」** を選択
5. **「ユースケース」** で **「Elastic Container Service」** を検索して選択
6. **「ユースケース」** の下に表示される選択肢から **「Elastic Container Service タスク」** を選択
7. **「次へ」** をクリック
8. **「許可ポリシーを追加」** 画面で、検索ボックスに `AmazonECSTaskExecutionRolePolicy` と入力
9. **「AmazonECSTaskExecutionRolePolicy」** にチェックを入れる
10. **「次へ」** をクリック
11. **「ロール名」** に `ecsTaskExecutionRole` と入力
12. **「説明（オプション）」** に `ECS task execution role for attendance app` と入力（任意）
13. **「ロールを作成」** をクリック

#### 2. ECSタスクロールの作成

1. **IAMコンソール** → **「ロール」** → **「ロールを作成」**
2. **「信頼されたエンティティタイプを選択」** で **「AWS のサービス」** を選択
3. **「ユースケース」** で **「Elastic Container Service」** を検索して選択
4. **「Elastic Container Service タスク」** を選択
5. **「次へ」** をクリック
6. **「許可ポリシーを追加」** 画面では、今回は何も選択せずに **「次へ」** をクリック（後でインラインポリシーを追加します）
7. **「ロール名」** に `ecsTaskRole` と入力
8. **「説明（オプション）」** に `ECS task role for attendance app` と入力（任意）
9. **「ロールを作成」** をクリック

#### 3. ECSタスクロールにインラインポリシーを追加

1. 作成した **「ecsTaskRole」** をクリック
2. **「許可」** タブをクリック
3. **「許可を追加」** → **「インラインポリシーを作成」** をクリック
4. **「JSON」** タブをクリック
5. 既存の内容を削除して、以下を貼り付け：

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

6. **「次へ」** をクリック
7. **「ポリシー名」** に `ECSBasicPolicy` と入力
8. **「ポリシーを作成」** をクリック

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

