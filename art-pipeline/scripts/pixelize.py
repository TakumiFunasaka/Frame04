"""
AI生成画像をゲーム用ドット絵に変換するスクリプト
入力: SDXL等で生成した高解像度のメカ画像
出力: パレット制限 + ダウンスケールされたドット絵スプライト

Usage:
    python scripts/pixelize.py input.png                     # デフォルト64x64
    python scripts/pixelize.py input.png --size 48           # 48x48
    python scripts/pixelize.py input.png --size 64 --preview # 拡大プレビューも出力
"""

import argparse
import sys
from pathlib import Path
from PIL import Image
import math

# Into the Breach + FRAME:04 向けパレット (24色)
# Gemini画像の分析に基づいて、暖色エフェクト・シアン光・紫エネルギー等を含む
FRAME04_PALETTE = [
    # 基本色
    (10, 10, 18),       # ほぼ黒（背景・輪郭）
    (25, 28, 45),       # ダークネイビー
    (45, 50, 70),       # ダークブルーグレー
    (70, 78, 100),      # ミディアムグレー
    (110, 118, 135),    # ライトグレー
    (165, 172, 182),    # 明るいグレー
    (220, 225, 230),    # ほぼ白
    (255, 255, 255),    # 白（ハイライト）

    # 暖色（エネルギー・炎・攻撃）
    (120, 30, 20),      # ダークレッド
    (200, 60, 40),      # レッド
    (240, 130, 40),     # オレンジ
    (255, 200, 80),     # イエロー（爆発・光）

    # 寒色（シールド・回復・水）
    (20, 60, 100),      # ダークブルー
    (40, 120, 180),     # ブルー
    (60, 200, 220),     # シアン（エネルギー光）
    (180, 240, 255),    # ライトシアン

    # 紫（魔導・電磁）
    (60, 30, 90),       # ダークパープル
    (120, 50, 160),     # パープル
    (180, 100, 220),    # ライトパープル

    # アース（装甲・機体色）
    (60, 50, 35),       # ダークブラウン
    (100, 85, 55),      # ブラウン
    (55, 80, 50),       # ダークグリーン
    (90, 130, 80),      # グリーン

    # メタル（機体ベース）
    (80, 70, 85),       # ダークメタル
    (140, 135, 150),    # メタルグレー
]


def find_closest_color(r, g, b, palette):
    """ピクセルに最も近いパレット色を返す（加重ユークリッド距離）"""
    min_dist = float("inf")
    closest = palette[0]
    for pr, pg, pb in palette:
        # 人間の色知覚に合わせた加重
        dr = (r - pr) * 0.30
        dg = (g - pg) * 0.59
        db = (b - pb) * 0.11
        dist = dr * dr + dg * dg + db * db
        if dist < min_dist:
            min_dist = dist
            closest = (pr, pg, pb)
    return closest


def remove_background(img, threshold=35):
    """暗い背景を透明にする"""
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r < threshold and g < threshold and b < threshold:
                pixels[x, y] = (0, 0, 0, 0)
    return img


def auto_crop(img, padding=2):
    """透明でない部分を自動トリミング"""
    bbox = img.getbbox()
    if bbox is None:
        return img
    x1, y1, x2, y2 = bbox
    x1 = max(0, x1 - padding)
    y1 = max(0, y1 - padding)
    x2 = min(img.width, x2 + padding)
    y2 = min(img.height, y2 + padding)
    return img.crop((x1, y1, x2, y2))


def make_square(img, target_size):
    """正方形キャンバスの中央に配置"""
    # アスペクト比を維持してリサイズ
    ratio = min(target_size / img.width, target_size / img.height)
    new_w = max(1, int(img.width * ratio))
    new_h = max(1, int(img.height * ratio))
    resized = img.resize((new_w, new_h), Image.NEAREST)

    # 正方形キャンバスの中央に配置
    canvas = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    x = (target_size - new_w) // 2
    y = (target_size - new_h) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas


def apply_palette(img, palette):
    """パレット制限を適用"""
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 128:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                cr, cg, cb = find_closest_color(r, g, b, palette)
                pixels[x, y] = (cr, cg, cb, 255)
    return img


def add_outline(img, color=(25, 28, 45, 255)):
    """スプライトの外側に1pxアウトラインを追加（ITBスタイル）"""
    w, h = img.size
    pixels = img.load()
    outline = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out_pixels = outline.load()

    for y in range(h):
        for x in range(w):
            if pixels[x, y][3] < 128:
                # 透明ピクセル → 隣に不透明があればアウトライン
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and pixels[nx, ny][3] >= 128:
                        out_pixels[x, y] = color
                        break

    # アウトラインを下に、元画像を上に合成
    result = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    result = Image.alpha_composite(result, outline)
    result = Image.alpha_composite(result, img)
    return result


def pixelize(input_path, output_dir, target_size=64, do_preview=False, do_outline=True):
    """メイン処理"""
    img = Image.open(input_path).convert("RGBA")
    name = Path(input_path).stem

    print(f"Input: {img.width}x{img.height}")

    # 1. 背景除去
    print("  [1/5] Removing background...")
    img = remove_background(img)

    # 2. 自動トリミング
    print("  [2/5] Auto-cropping...")
    img = auto_crop(img)
    print(f"  Cropped to: {img.width}x{img.height}")

    # 3. ダウンスケール（Nearest Neighbor = ドット絵に最適）
    print(f"  [3/5] Downscaling to {target_size}x{target_size}...")
    img = make_square(img, target_size)

    # 4. パレット制限
    print("  [4/5] Applying FRAME:04 palette (24 colors)...")
    img = apply_palette(img, FRAME04_PALETTE)

    # 5. アウトライン追加
    if do_outline:
        print("  [5/5] Adding outline...")
        img = add_outline(img)

    # 保存
    output_path = output_dir / f"{name}_{target_size}px.png"
    img.save(output_path, "PNG")
    print(f"  Saved: {output_path}")

    # プレビュー（8倍拡大）
    if do_preview:
        scale = max(1, 512 // target_size)
        preview = img.resize((target_size * scale, target_size * scale), Image.NEAREST)
        preview_path = output_dir / f"{name}_{target_size}px_preview.png"
        preview.save(preview_path, "PNG")
        print(f"  Preview ({scale}x): {preview_path}")

    return output_path


def main():
    parser = argparse.ArgumentParser(description="Pixelize AI-generated mech images")
    parser.add_argument("input", type=Path, help="Input image or directory")
    parser.add_argument("--size", type=int, default=64, help="Target sprite size (default: 64)")
    parser.add_argument("--preview", action="store_true", help="Also generate enlarged preview")
    parser.add_argument("--no-outline", action="store_true", help="Skip outline generation")
    parser.add_argument("--output", type=Path, default=None, help="Output directory")
    args = parser.parse_args()

    output_dir = args.output or Path(__file__).parent.parent / "output"
    output_dir.mkdir(parents=True, exist_ok=True)

    if args.input.is_dir():
        images = sorted(p for p in args.input.iterdir() if p.suffix.lower() in (".png", ".jpg", ".webp"))
    else:
        images = [args.input]

    for img_path in images:
        print(f"\n=== Processing: {img_path.name} ===")
        pixelize(img_path, output_dir, args.size, args.preview, not args.no_outline)

    print(f"\n=== Done! Output in {output_dir} ===")


if __name__ == "__main__":
    main()
