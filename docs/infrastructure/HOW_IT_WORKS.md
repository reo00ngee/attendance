# 🔄 CI/CDパイプラインの仕組み

> **📖 関連ドキュメント:**  
> - [GET_STARTED.md](./GET_STARTED.md) - 実際のデプロイ手順  
> - [README.md](./README.md) - インフラ設計の詳細

## 📊 全体の流れ

```
┌─────────────────────────────────────────────────────────────┐
│  1. 準備フェーズ（手動、初回のみ）                              │
│     GET_STARTED.md に従って設定                                │
│     - AWSリソース作成（ECR、ECS、S3など）                      │
│     - GitHub Secrets設定                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  2. 自動デプロイフェーズ（自動、mainブランチにプッシュで実行）    │
│     .github/workflows/deploy.yml が自動実行                   │
│                                                               │
│     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│     │ Backend Test │→ │ Backend Build│→ │ Backend      │    │
│     │              │  │              │  │ Deploy       │    │
│     └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                               │
│     ┌──────────────┐  ┌──────────────┐                      │
│     │ Frontend Test│→ │ Frontend     │                      │
│     │              │  │ Deploy       │                      │
│     └──────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

## 📝 ファイルの役割

### 1. `.github/workflows/deploy.yml` 
**→ これが実際のCI/CDパイプライン（自動デプロイ）**

- `main`ブランチにプッシュすると**自動的に実行される**
- テスト → ビルド → デプロイを自動で行う
- GitHub Actionsが実行する

**実行内容:**
```yaml
1. Backend Test (PHPUnit, リンティング)
2. Frontend Test (ESLint, Jest, ビルド)
3. Backend Build (DockerイメージをECRにプッシュ)
4. Frontend Deploy (S3にデプロイ、CloudFrontキャッシュ無効化)
5. Backend Deploy (ECS Fargateにデプロイ)
6. Health Check (動作確認)
```

### 2. `GET_STARTED.md`
**→ これは設定手順書（準備用）**

- 初回のみ手動で実行する
- AWSリソースを作成する
- GitHub Secretsを設定する
- **パイプラインを動かすための準備**

**実行内容:**
```bash
1. AWS CLIの設定
2. ECRリポジトリの作成
3. ECSクラスターの作成
4. S3バケットの作成
5. GitHub Secretsの設定
```

## 🎯 実際の使い方

### 初回セットアップ（1回だけ）

```bash
# GET_STARTED.md に従って手動で実行
aws ecr create-repository --repository-name attendance-backend
aws ecs create-cluster --cluster-name attendance-cluster
# ... など
```

### 日常的なデプロイ（自動）

```bash
# コードを変更してmainブランチにプッシュ
git add .
git commit -m "Update feature"
git push origin main

# ↓ 自動的に .github/workflows/deploy.yml が実行される
# ↓ GitHub Actionsがテスト→ビルド→デプロイを実行
```

## 🔍 確認方法

### CI/CDパイプラインが動いているか確認

1. GitHubリポジトリを開く
2. **Actions** タブをクリック
3. `Deploy to AWS` ワークフローが実行されているか確認

### パイプラインのログを確認

1. GitHubリポジトリ → **Actions**
2. 実行中のワークフローをクリック
3. 各ステップのログを確認

## ❓ よくある質問

### Q: GET_STARTED.mdを実行するとデプロイされるの？

**A: いいえ。** GET_STARTED.mdは**準備作業**です。  
実際のデプロイは `.github/workflows/deploy.yml` が自動で行います。

### Q: 毎回GET_STARTED.mdの手順を実行するの？

**A: いいえ。** 初回のみです。  
2回目以降は、コードをプッシュするだけで自動デプロイされます。

### Q: デプロイはいつ実行されるの？

**A: `main`ブランチにプッシュしたとき**に自動実行されます。  
または、GitHub Actionsの画面から手動実行も可能です。

## 📋 まとめ

| ファイル | 役割 | 実行タイミング | 実行方法 |
|---------|------|---------------|---------|
| `.github/workflows/deploy.yml` | **実際のCI/CDパイプライン** | `main`ブランチにプッシュ時 | **自動** |
| `GET_STARTED.md` | 設定手順書 | 初回のみ | **手動** |

**つまり:**
- `GET_STARTED.md` = 準備（手動、1回だけ）
- `deploy.yml` = デプロイ（自動、毎回）

