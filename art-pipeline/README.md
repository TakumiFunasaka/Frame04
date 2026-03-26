# Frame04 Art Pipeline

Into the Breach風メカドット絵の生成パイプライン。

## セットアップ

```bash
cd art-pipeline
chmod +x setup.sh
./setup.sh
```

ダウンロードされるもの:
- ComfyUI本体
- SDXL base model (~6.5GB)
- SD 1.5 model (~4.3GB)
- Pixel Art XL LoRA

## 使い方

### 1. ComfyUI起動
```bash
./start.sh
# ブラウザで http://127.0.0.1:8188 を開く
```

### 2. GUIで試す
- ブラウザでワークフローを読み込み: workflows/pixel_mech_sdxl.json
- プロンプトを調整して Generate

### 3. バッチ生成
```bash
source venv/bin/activate

# 全バリアント生成
python scripts/batch_generate.py

# 特定のバリアントのみ
python scripts/batch_generate.py --variant scout_01

# バリアントごとに5パターン
python scripts/batch_generate.py --seeds 5
```

### 4. 後処理（パレット統一 + リサイズ）
```bash
# 64x64にリサイズ + パレット制限
python scripts/post_process.py

# 32x32にリサイズ
python scripts/post_process.py --size 32

# スプライトシートも生成 + プレビュー用拡大
python scripts/post_process.py --spritesheet --upscale 256
```

## ファイル構成

```
art-pipeline/
├── setup.sh                 # 初回セットアップ
├── start.sh                 # ComfyUI起動
├── comfyui/                 # ComfyUI本体 (setup.shで生成)
├── workflows/
│   └── pixel_mech_sdxl.json # ドット絵メカ生成ワークフロー
├── prompts/
│   └── mech_variants.json   # メカバリエーション定義
├── scripts/
│   ├── batch_generate.py    # バッチ生成スクリプト
│   └── post_process.py      # 後処理（パレット統一等）
└── output/                  # 最終出力
```

## カスタマイズ

### メカの種類を追加
`prompts/mech_variants.json` に新しいvariantを追加:
```json
{
  "id": "flying_01",
  "mech_type": "hovering aerial mech with jet wings",
  "color_scheme": "sky blue and white"
}
```

### パレットを変更
`scripts/post_process.py` の `DEFAULT_PALETTE` を編集。
