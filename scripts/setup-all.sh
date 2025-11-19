#!/bin/bash
# すべてのセットアップを一括実行するスクリプト
# 実行方法: bash scripts/setup-all.sh

set -e  # エラーが発生したら停止

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 AWSインフラセットアップを開始します"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: ネットワーク基盤の構築
echo "📋 Step 1: ネットワーク基盤の構築"
bash scripts/setup-network.sh

echo ""
read -p "Enterキーを押して続行..." -r
echo ""

# Step 2: AWSリソースの作成
echo "📋 Step 2: AWSリソース（ECR、ECS、S3）の作成"
bash scripts/setup-aws-resources.sh

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ セットアップが完了しました！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 次のステップ:"
echo "1. GitHub Secretsを設定（GET_STARTED.md の Step 3 を参照）"
echo "2. ワークフローファイルを更新（GET_STARTED.md の Step 4 を参照）"
echo "3. 初回デプロイを実行（GET_STARTED.md の Step 5 を参照）"
echo ""

