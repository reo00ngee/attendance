# トラブルシューティングガイド

## 🔴 よくあるエラーと解決方法

### エラー0: ポリシーサイズがクォータを超える

**エラーメッセージ:**
```
選択されたポリシーがこのアカウントのクォータを超えています
```

**原因:**
IAMマネージドポリシーにはサイズ制限（約6,144文字）があります。

**解決方法:**

インラインポリシー（ユーザーに直接アタッチ）を使用：

1. IAM → ユーザー → `attendance-deploy-user` を選択
2. 「許可」タブ → 「インラインポリシーを追加」
3. 「JSON」タブでポリシーを貼り付け
4. ポリシー名: `AttendanceAppCICDPolicy`
5. 「ポリシーの作成」をクリック

詳細は [IAM_POLICY_ALTERNATIVE.md](./IAM_POLICY_ALTERNATIVE.md) を参照してください。

---

### エラー1: UnauthorizedOperation - ec2:CreateTags

**エラーメッセージ:**
```
An error occurred (UnauthorizedOperation) when calling the CreateVpc operation: 
You are not authorized to perform this operation. 
User: arn:aws:iam::XXX:user/attendance-deploy-user is not authorized to perform: 
ec2:CreateTags on resource: arn:aws:ec2:ap-northeast-1:XXX:vpc/*
```

**原因:**
IAMポリシーにEC2の権限（特に`ec2:CreateTags`）が不足しています。

**解決方法:**

1. **IAMポリシーを更新**
   - AWSコンソール → IAM → ポリシー
   - `AttendanceAppCICDPolicy` を選択
   - 「編集」をクリック
   - JSONタブで、以下の`EC2NetworkAccess`セクションを追加または確認：

```json
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
}
```

2. **ポリシーを保存**
   - 「変更の確認」をクリック
   - 「変更の保存」をクリック

3. **再実行**
   - 数秒待ってから、再度コマンドを実行

**確認:**
```bash
# 権限が正しく設定されているか確認
aws iam get-user-policy \
  --user-name attendance-deploy-user \
  --policy-name AttendanceAppCICDPolicy
```

---

### エラー2: VPCは作成されたが、タグが付けられなかった

**状況:**
- VPC IDが表示されたが、エラーメッセージも表示された

**対処方法:**

VPCは作成されているので、手動でタグを付けます：

```bash
# VPC IDを確認（エラーメッセージから取得、または以下で確認）
VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=tag:Name,Values=attendance-vpc" \
  --query 'Vpcs[0].VpcId' \
  --output text)

# タグを手動で追加
aws ec2 create-tags \
  --resources ${VPC_ID} \
  --tags Key=Name,Value=attendance-vpc
```

その後、残りのネットワークリソースの作成を続行してください。

---

### エラー3: S3バケット名が既に使用されている

**エラーメッセージ:**
```
An error occurred (BucketAlreadyExists) when calling the CreateBucket operation: 
The requested bucket name is not available.
```

**原因:**
S3バケット名はグローバルでユニークである必要があります。

**解決方法:**

バケット名にタイムスタンプを追加するスクリプトを使用：

```bash
# よりユニークなバケット名を生成
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
TIMESTAMP=$(date +%s)
RANDOM_SUFFIX=$(openssl rand -hex 4)
BUCKET_NAME="attendance-frontend-${AWS_ACCOUNT_ID}-${TIMESTAMP}-${RANDOM_SUFFIX}"

echo "作成するS3バケット名: ${BUCKET_NAME}"
aws s3 mb s3://${BUCKET_NAME} --region ap-northeast-1
```

---

### エラー4: ECRリポジトリが既に存在する

**エラーメッセージ:**
```
An error occurred (RepositoryAlreadyExistsException) when calling the CreateRepository operation
```

**解決方法:**

既存のリポジトリを使用するか、別の名前で作成：

```bash
# 既存のリポジトリを確認
aws ecr describe-repositories --repository-names attendance-backend

# 既存のリポジトリを使用する場合は、そのまま続行
# 別の名前で作成する場合：
aws ecr create-repository \
  --repository-name attendance-backend-$(date +%s) \
  --region ap-northeast-1
```

---

### エラー5: セキュリティグループのルール追加に失敗

**エラーメッセージ:**
```
An error occurred (InvalidPermission.Duplicate) when calling the AuthorizeSecurityGroupIngress operation
```

**原因:**
同じルールが既に存在しています。

**解決方法:**

エラーを無視して続行するか、既存のルールを確認：

```bash
# 既存のルールを確認
aws ec2 describe-security-groups \
  --group-ids ${ECS_SG_ID} \
  --query 'SecurityGroups[0].IpPermissions'
```

---

### エラー6: RDSのDBサブネットグループが見つからない

**エラーメッセージ:**
```
InvalidParameterValue: DB subnet group does not exist
```

**解決方法:**

DBサブネットグループを先に作成：

```bash
# DBサブネットグループを作成
aws rds create-db-subnet-group \
  --db-subnet-group-name attendance-db-subnet-group \
  --db-subnet-group-description "Subnet group for attendance DB" \
  --subnet-ids ${PRIVATE_SUBNET_1} ${PRIVATE_SUBNET_2} \
  --region ap-northeast-1
```

---

## 🔍 デバッグコマンド

### 現在の権限を確認

```bash
# IAMユーザーのポリシーを確認
aws iam list-attached-user-policies --user-name attendance-deploy-user

# ポリシーの内容を確認
aws iam get-policy-version \
  --policy-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/AttendanceAppCICDPolicy \
  --version-id $(aws iam get-policy --policy-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/AttendanceAppCICDPolicy --query 'Policy.DefaultVersionId' --output text)
```

### 作成されたリソースを確認

```bash
# VPC一覧
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=attendance-vpc"

# サブネット一覧
aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VPC_ID}"

# セキュリティグループ一覧
aws ec2 describe-security-groups --filters "Name=vpc-id,Values=${VPC_ID}"

# ECRリポジトリ一覧
aws ecr describe-repositories

# ECSクラスター一覧
aws ecs list-clusters

# S3バケット一覧
aws s3 ls | grep attendance-frontend
```

---

## 🆘 緊急時の対処法

### すべてのリソースを削除して最初からやり直す

```bash
# 注意: このコマンドはすべてのリソースを削除します

# 1. ECSサービスを停止
aws ecs update-service \
  --cluster attendance-cluster \
  --service attendance-api-service \
  --desired-count 0

# 2. ECSタスク定義を削除
aws ecs deregister-task-definition \
  --task-definition attendance-backend-task

# 3. ECRリポジトリを削除（イメージも削除）
aws ecr delete-repository \
  --repository-name attendance-backend \
  --force

# 4. S3バケットを削除
aws s3 rb s3://${BUCKET_NAME} --force

# 5. セキュリティグループを削除
aws ec2 delete-security-group --group-id ${ECS_SG_ID}
aws ec2 delete-security-group --group-id ${RDS_SG_ID}

# 6. サブネットを削除
aws ec2 delete-subnet --subnet-id ${PUBLIC_SUBNET_1}
aws ec2 delete-subnet --subnet-id ${PUBLIC_SUBNET_2}
aws ec2 delete-subnet --subnet-id ${PRIVATE_SUBNET_1}
aws ec2 delete-subnet --subnet-id ${PRIVATE_SUBNET_2}

# 7. ルートテーブルを削除
aws ec2 delete-route-table --route-table-id ${ROUTE_TABLE_ID}

# 8. インターネットゲートウェイをデタッチ・削除
aws ec2 detach-internet-gateway \
  --vpc-id ${VPC_ID} \
  --internet-gateway-id ${IGW_ID}
aws ec2 delete-internet-gateway --internet-gateway-id ${IGW_ID}

# 9. VPCを削除
aws ec2 delete-vpc --vpc-id ${VPC_ID}

# 10. ECSクラスターを削除
aws ecs delete-cluster --cluster attendance-cluster
```

---

## 📝 ログの確認方法

### CloudWatch Logs

```bash
# ECSタスクのログを確認
aws logs tail /ecs/attendance-backend --follow
```

### GitHub Actions

1. GitHubリポジトリ → Actions
2. 失敗したワークフローを選択
3. 各ステップのログを確認

---

## 💡 予防策

1. **IAMポリシーを事前に確認**
   - 必要な権限がすべて含まれているか確認

2. **リソース名をユニークにする**
   - タイムスタンプやランダム文字列を使用

3. **段階的に実行**
   - 一度にすべてを実行せず、ステップごとに確認

4. **リソースIDをメモ**
   - 各ステップで作成されたリソースIDを記録

---

**🔗 関連ドキュメント:**
- [GET_STARTED.md](./GET_STARTED.md) - デプロイ手順
- [README.md](./README.md) - インフラ設計詳細

