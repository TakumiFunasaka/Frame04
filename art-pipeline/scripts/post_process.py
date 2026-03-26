"""
Frame04 Post-Processing Pipeline
生成画像をゲームアセット用にドット絵化・パレット統一・リサイズする

Usage:
    python scripts/post_process.py                          # 全画像を処理
    python scripts/post_process.py --input output/raw       # 特定フォルダ
    python scripts/post_process.py --size 32                # 32x32にリサイズ
    python scripts/post_process.py --palette palette.png    # カスタムパレット
"""

import argparse
from pathlib import Path
from PIL import Image
import colorsys

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DEFAULT_INPUT = PROJECT_DIR / "comfyui" / "output"
DEFAULT_OUTPUT = PROJECT_DIR / "output"

# Into the Breach風の制限パレット (16色)
DEFAULT_PALETTE = [
    (13, 15, 24),      # 黒に近い紺
    (27, 38, 59),      # ダークネイビー
    (49, 62, 80),      # ダークグレーブルー
    (75, 90, 107),     # ミディアムグレー
    (117, 133, 148),   # ライトグレー
    (170, 183, 192),   # 明るいグレー
    (222, 229, 231),   # ほぼ白
    (255, 255, 255),   # 白
    (163, 48, 48),     # ダークレッド
    (215, 89, 76),     # レッド
    (47, 105, 87),     # ダークグリーン
    (82, 153, 114),    # グリーン
    (55, 78, 136),     # ブルー
    (93, 130, 178),    # ライトブルー
    (186, 141, 63),    # ゴールド
    (227, 196, 119),   # ライトゴールド
]


def find_closest_color(pixel: tuple, palette: list[tuple]) -> tuple:
    """ピクセルに最も近いパレット色を返す"""
    min_dist = float("inf")
    closest = palette[0]
    r, g, b = pixel[:3]
    for pr, pg, pb in palette:
        dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2
        if dist < min_dist:
            min_dist = dist
            closest = (pr, pg, pb)
    return closest


def apply_palette(image: Image.Image, palette: list[tuple]) -> Image.Image:
    """画像にパレット制限を適用"""
    img = image.convert("RGBA")
    pixels = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 128:  # 半透明以下は透明に
                pixels[x, y] = (0, 0, 0, 0)
            else:
                cr, cg, cb = find_closest_color((r, g, b), palette)
                pixels[x, y] = (cr, cg, cb, 255)
    return img


def downscale_nearest(image: Image.Image, target_size: int) -> Image.Image:
    """Nearest Neighborでドット絵を崩さずリサイズ"""
    return image.resize((target_size, target_size), Image.NEAREST)


def remove_background(image: Image.Image, bg_threshold: int = 30) -> Image.Image:
    """暗い背景を透明にする"""
    img = image.convert("RGBA")
    pixels = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # 暗いピクセル（黒背景）を透明に
            if r < bg_threshold and g < bg_threshold and b < bg_threshold:
                pixels[x, y] = (0, 0, 0, 0)
    return img


def process_image(
    input_path: Path,
    output_dir: Path,
    target_size: int,
    palette: list[tuple],
    remove_bg: bool = True,
) -> Path:
    """1枚の画像を処理"""
    img = Image.open(input_path).convert("RGBA")

    # 1. 背景除去
    if remove_bg:
        img = remove_background(img)

    # 2. ダウンスケール（ドット絵化）
    img = downscale_nearest(img, target_size)

    # 3. パレット制限
    img = apply_palette(img, palette)

    # 保存
    output_path = output_dir / f"{input_path.stem}_{target_size}px.png"
    img.save(output_path, "PNG")
    return output_path


def create_spritesheet(
    images: list[Path], output_path: Path, cols: int = 4
) -> Path:
    """複数画像を1枚のスプライトシートに結合"""
    if not images:
        return output_path

    first = Image.open(images[0])
    w, h = first.size
    rows = (len(images) + cols - 1) // cols

    sheet = Image.new("RGBA", (w * cols, h * rows), (0, 0, 0, 0))

    for i, img_path in enumerate(images):
        img = Image.open(img_path)
        col = i % cols
        row = i // cols
        sheet.paste(img, (col * w, row * h))

    sheet.save(output_path, "PNG")
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Post-process generated mech sprites")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="Input directory")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Output directory")
    parser.add_argument("--size", type=int, default=64, help="Target sprite size (e.g. 32, 64)")
    parser.add_argument("--no-bg-remove", action="store_true", help="Skip background removal")
    parser.add_argument("--spritesheet", action="store_true", help="Also create spritesheet")
    parser.add_argument("--upscale", type=int, default=None, help="Upscale for preview (e.g. 256)")
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)

    # 入力画像を探す
    input_images = sorted(
        p for p in args.input.iterdir()
        if p.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp")
    )

    if not input_images:
        print(f"No images found in {args.input}")
        print("Run batch_generate.py first, or specify --input directory")
        return

    print(f"=== Post-Processing {len(input_images)} images ===")
    print(f"  Target size: {args.size}x{args.size}")
    print(f"  Palette: 16 colors (Into the Breach style)")
    print()

    processed = []
    for img_path in input_images:
        print(f"  Processing: {img_path.name}")
        output_path = process_image(
            img_path,
            args.output,
            args.size,
            DEFAULT_PALETTE,
            remove_bg=not args.no_bg_remove,
        )
        processed.append(output_path)
        print(f"    -> {output_path.name}")

        # プレビュー用に拡大版も保存
        if args.upscale:
            preview = Image.open(output_path)
            preview = preview.resize(
                (args.upscale, args.upscale), Image.NEAREST
            )
            preview_path = args.output / f"{img_path.stem}_{args.upscale}px_preview.png"
            preview.save(preview_path, "PNG")
            print(f"    -> {preview_path.name} (preview)")

    # スプライトシート生成
    if args.spritesheet and processed:
        sheet_path = args.output / "spritesheet.png"
        create_spritesheet(processed, sheet_path)
        print(f"\n  Spritesheet: {sheet_path.name}")

        if args.upscale:
            sheet = Image.open(sheet_path)
            scale = args.upscale // args.size
            sheet_preview = sheet.resize(
                (sheet.width * scale, sheet.height * scale), Image.NEAREST
            )
            preview_path = args.output / "spritesheet_preview.png"
            sheet_preview.save(preview_path, "PNG")
            print(f"  Spritesheet preview: {preview_path.name}")

    print(f"\n=== Done! Output in {args.output} ===")


if __name__ == "__main__":
    main()
