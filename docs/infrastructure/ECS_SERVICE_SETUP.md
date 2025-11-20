# ECSサービスとALBの作成手順

ECSサービスとALB（Application Load Balancer）を作成する手順です。

## 📋 必要なリソース

- VPC ID: `vpc-08f1650afa45efb02`
- サブネット ID: `subnet-0b2f1ff088671f7df,subnet-03ca53640de79ade0`
- セキュリティグループ ID: `sg-09e2841dce32a4347`
- ECSクラスター: `attendance-cluster`
- タスク定義: `attendance-backend-task`（GitHub Actionsで作成済み）

## 🚀 作成手順

### 1. CloudWatch Logsグループの作成（既に作成済みの可能性あり）

1. **CloudWatchコンソール** → **ログ** → **ロググループ**
2. **ロググループを作成** → 名前: `/ecs/attendance-backend` → **作成**

### 2. ALB（Application Load Balancer）の作成

1. **EC2コンソール** → **ロードバランサー** → **ロードバランサーを作成**
2. **ロードバランサータイプ**: Application Load Balancer → **作成**
3. **基本設定**:
   - **名前**: `attendance-alb`
   - **スキーム**: インターネット向け
   - **IPアドレスタイプ**: IPv4
4. **ネットワークマッピング**:
   - **VPC**: `vpc-08f1650afa45efb02`（デフォルトVPC）
   - **アベイラビリティゾーン**: すべて選択（ap-northeast-1a, ap-northeast-1c など）
5. **セキュリティグループ**:
   - **既存のセキュリティグループを選択**: `sg-09e2841dce32a4347`（attendance-ecs-sg）
6. **リスナーとルーティング**:
   - **プロトコル**: HTTP
   - **ポート**: 80
   - **デフォルトアクション**: 新しいターゲットグループを作成
7. **ターゲットグループの設定**:
   - **ターゲットタイプ**: IP
   - **名前**: `attendance-tg`
   - **プロトコル**: HTTP
   - **ポート**: 80
   - **VPC**: `vpc-08f1650afa45efb02`
   - **ヘルスチェック**:
     - **プロトコル**: HTTP
     - **パス**: `/api/health`
     - **正常性チェック間隔**: 30秒
     - **タイムアウト**: 5秒
     - **正常な閾値**: 2
     - **異常な閾値**: 3
8. **確認と作成** → **ロードバランサーを作成**

### 3. ECSサービスの作成

1. **ECSコンソール** → **クラスター** → **attendance-cluster** を選択
2. **サービス** タブ → **作成**
3. **サービス設定**:
   - **起動タイプ**: Fargate
   - **オペレーティングシステム/アーキテクチャ**: Linux/X86_64
   - **タスク定義**:
     - **ファミリー**: `attendance-backend-task`
     - **リビジョン**: 最新（LATEST）
   - **サービス名**: `attendance-api-service`
   - **サービスタイプ**: Replica
   - **必要なタスク数**: 1
4. **ネットワーク**:
   - **VPC**: `vpc-08f1650afa45efb02`
   - **サブネット**: 
     - `subnet-0b2f1ff088671f7df`
     - `subnet-03ca53640de79ade0`
   - **セキュリティグループ**: `sg-09e2841dce32a4347`（attendance-ecs-sg）
   - **パブリックIPの自動割り当て**: 有効
5. **ロードバランシング**:
   - **ロードバランサータイプ**: Application Load Balancer
   - **ロードバランサー**: `attendance-alb`
   - **コンテナ名**: `laravel-api`
   - **コンテナポート**: 80
   - **ターゲットグループ**: `attendance-tg`
6. **サービス検出（オプション）**: スキップ
7. **オートスケーリング**: スキップ（後で設定可能）
8. **確認と作成** → **サービスの作成**

## ✅ 確認

### ALBのDNS名を確認

1. **EC2コンソール** → **ロードバランサー** → **attendance-alb** を選択
2. **説明** タブで **DNS名** を確認（例: `attendance-alb-123456789.ap-northeast-1.elb.amazonaws.com`）

### GitHub Secretsの更新

ALBのDNS名を確認したら、GitHub Secretsを更新：

1. **GitHubリポジトリ** → **Settings** → **Secrets and variables** → **Actions**
2. 以下のSecretsを更新：
   - `API_URL`: `http://[ALBのDNS名]`
   - `REACT_APP_API_URL`: `http://[ALBのDNS名]`

例：
- `API_URL`: `http://attendance-alb-123456789.ap-northeast-1.elb.amazonaws.com`
- `REACT_APP_API_URL`: `http://attendance-alb-123456789.ap-northeast-1.elb.amazonaws.com`

## 🔄 次のステップ

ECSサービスとALBの作成が完了したら：

1. GitHub Secretsを更新（上記参照）
2. 再度デプロイを実行：
   ```bash
   git push origin main
   ```

## ⚠️ 注意事項

- ALBの作成には数分かかります
- ECSサービスの作成後、タスクが起動するまで数分かかります
- ヘルスチェックが成功するまで、ALBはトラフィックを転送しません

---

**参考**: [GET_STARTED.md](./GET_STARTED.md)

